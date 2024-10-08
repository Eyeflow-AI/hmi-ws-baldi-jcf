import axios from "axios";

import Mongo from "../../../components/mongo";
import getPartData from "../../../utils/getPartData";
import parseIntThrowError from "../../../utils/parseIntThrowError";
import errors from "../../../utils/errors"
import lodash from "lodash";
import log from "../../../utils/log";

async function putResume(req, res, next) {

  const timeout = 10000;
  try {
    let stationId = new Mongo.ObjectId(req.params.stationId);
    let batchId = new Mongo.ObjectId(req.params.batchId);

    let stationDocument = await Mongo.db.collection("station").findOne({ _id: stationId });
    if (!stationDocument) {
      let err = new Error(`Station with _id ${stationId} not found`);
      err.status = 400;
      throw err;
    };

    let postBatchURL = stationDocument?.parms?.postBatchURL;
    if (!postBatchURL) {
      let err = new Error(`Station with _id ${stationId} does not have parms.postBatchURL`);
      err.status = 400;
      throw err;
    };

    let runningBatch = await Mongo.db.collection("batch").findOne({ station: stationId, status: "running" });
    if (runningBatch) {
      let err = new Error(`Batch with _id ${runningBatch._id} is already running`);
      err.status = 400;
      throw err;
    };

    let batchDocument = await Mongo.db.collection("batch").findOne({ _id: batchId });
    if (!batchDocument) {
      let err = new Error(`Batch with _id ${batchId} not found`);
      err.status = 400;
      throw err;
    };

    if (batchDocument.status !== "paused") {
      let err = new Error(`Batch with _id ${batchId} is not paused`);
      err.status = 400;
      throw err;
    };

    if (batchDocument?.info?.part_id === undefined) {
      let err = new Error(`Batch with _id ${batchId} does not have info.part_id`);
      err.status = 400;
      throw err;
    };

    let partData = await getPartData(batchDocument.info.part_id);

    let postRequestBody = {
      batch: {
        _id: batchDocument._id,
        status: "resume_batch",
        total_packs: parseIntThrowError(batchDocument.info.total_packs, `Failed to parse batchDocument.info.total_packs ${batchDocument.info.total_packs} as integer`),
        parts_per_pack: parseIntThrowError(batchDocument.info.parts_per_pack, `Failed to parse batchDocument.info.parts_per_pack ${batchDocument.info.parts_per_pack} as integer`),
        profile_parms: partData.color_profile,
        current_pack: batchDocument?.batch_data?.pack_num ?? 1,
        current_total_output_parts: batchDocument?.batch_data?.total_output_parts ?? 0,
      },
      part_data: {...partData},
    };
    delete postRequestBody.part_data.color_profile;

    if (batchDocument?.batch_data?.hasOwnProperty("ok")) {
      postRequestBody.batch.ok = batchDocument.batch_data.ok;
    };
    if (batchDocument?.batch_data?.hasOwnProperty("ng")) {
      postRequestBody.batch.ng = batchDocument.batch_data.ng;
    };

    postRequestBody.env_var = lodash.cloneDeep(postRequestBody);
    try {
      // TODO: Try again on fail. Maybe use a queue?
      let response = await axios.post(postBatchURL, postRequestBody, { timeout });
      if (![200, 201].includes(response.status)) {
        log.info(`Successfully resumed batch ${batchId} in station ${stationId}`);
      }
      else {
        log.error(`Failed to resume batch ${batchId} in station ${stationId}`);
      }
    }
    catch (err) {
      log.error(`Failed to resume batch ${batchId} in station ${stationId}. Error: ${err}`);
    }

    let result = await Mongo.db.collection("batch").updateOne(
      { _id: batchId, status: "paused" },
      { $set: { status: "running" }, $push: { "debug.data_sent_to_edge_station": postRequestBody } }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json({ ok: true });
    }
    else {
      let err = new Error(`Could not update batch ${batchId}`);
      err.status = 400;
      throw err;
    }
  }
  catch (err) {
    if (err?.code === "ECONNREFUSED") {
      let address = err.address;
      let port = err.port;
      err = new Error(`Edge station is not reachable`);
      err.code = errors.EDGE_STATION_IS_NOT_REACHABLE;
      err.status = 500;
      if (address && port) {
        err.extraData = { address, port, timeout };
      }
    }
    else if (err?.code === "ECONNABORTED") {
      let address = err.address;
      let port = err.port;
      err.code = errors.EDGE_STATION_IS_NOT_REACHABLE;
      err.status = 500;
      if (address && port) {
        err.extraData = { address, port, timeout };
      }
    };
    next(err);
  };
};

export default putResume;