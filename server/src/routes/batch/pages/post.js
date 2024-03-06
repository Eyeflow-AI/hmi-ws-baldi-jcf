import axios from "axios";

import Mongo from "../../../components/mongo";
import getPartData from "../../../utils/getPartData";
import errors from "../../../utils/errors";
import parseIntThrowError from "../../../utils/parseIntThrowError";
import lodash from "lodash";
import log from "../../../utils/log";

// req.body example
// {
//   "part_id": "CA-165-037:OU43",
//   "description": "CAPA ATUADOR 37 - OURO CLARO M1 3/5 ACETINADO FS",
//   "production_order": "123",
//   "total_packs": 1,
//   "parts_per_pack": 7500
// }

function getUpdateRequestBody(body) {
  let {
    part_id,
    description,
    production_order,
    total_packs,
    parts_per_pack,
    ...data
  } = body;
  if (!part_id) {
    let err = new Error(`Non empty part_id is required`);
    err.status = 400;
    throw err;
  }
  if (!description) {
    let err = new Error(`Non empty description is required`);
    err.status = 400;
    throw err;
  }
  if (!production_order) {
    let err = new Error(`Non empty production_order is required`);
    err.status = 400;
    throw err;
  }

  if (total_packs !== undefined) {
    total_packs = parseIntThrowError(
      total_packs,
      `Failed to parse total_packs ${total_packs} as integer`
    );
  }

  if (parts_per_pack !== undefined) {
    parts_per_pack = parseIntThrowError(
      parts_per_pack,
      `Failed to parse parts_per_pack ${parts_per_pack} as integer`
    );
  }

  return {
    part_id,
    description,
    production_order,
    total_packs,
    parts_per_pack,
    ...data,
  };
}

// Axios Post Body example
// {
//     "batch": {
//         "status": "new_batch",
//         "_id": "object_id",
//         "total_packs": 5,
//         "parts_per_pack": 100,
//         "profile_parms": {
//             "name": "Jet Black",
//             "exposure_time": "17000",
//             "gain": "20",
//             "gamma": "1.2",
//             "balance_ratio_red": "1000",
//             "balance_ratio_blue": "4000",
//             "balance_ratio_green": "3500"
//         }
//     }
// }

async function post(req, res, next) {
  const timeout = 10000;
  try {
    let stationId = new Mongo.ObjectId(req.params.stationId);
    let body = getUpdateRequestBody(req.body);

    let stationDocument = await Mongo.db
      .collection("station")
      .findOne({ _id: stationId });
    if (!stationDocument) {
      let err = new Error(`Station with _id ${stationId} not found`);
      err.status = 400;
      throw err;
    }

    let postBatchURL = stationDocument?.parms?.postBatchURL;
    if (!postBatchURL) {
      let err = new Error(
        `Station with _id ${stationId} does not have parms.postBatchURL`
      );
      err.status = 400;
      throw err;
    }

    let runningBatch = await Mongo.db
      .collection("batch")
      .findOne({ station: stationId, status: "running" });
    if (runningBatch) {
      let err = new Error(
        `Batch with _id ${runningBatch._id} is already running in station ${stationId}`
      );
      err.status = 400;
      throw err;
    }

    let batchId = new Mongo.ObjectId();
    let origin = "parts_register";
    let url = null;
    if (body?.maskMapListURL) {
      origin = "maskMapList";
      url = body.maskMapListURL;
    }
    console.log({ body });
    let partData = await getPartData(body.part_id, origin, url);

    let newBatchDocument = {
      _id: batchId,
      station: stationId,
      start_time: new Date(),
      status: "running",
      info: {
        ...body,
      },
    };

    let postRequestBody = {
      batch: {
        _id: newBatchDocument._id,
        status: "new_batch",
        profile_parms: partData.color_profile,
        ...body,
      },
      part_data: { ...partData },
    };
    delete postRequestBody.part_data.color_profile;

    postRequestBody.env_var = lodash.cloneDeep(postRequestBody);
    try {
      // TODO: Try again on fail. Maybe use a queue?
      let response = await axios.post(postBatchURL, postRequestBody, {
        timeout,
      });
      if (![200, 201].includes(response.status)) {
        log.info(
          `Successfully started batch ${batchId} in station ${stationId}`
        );
      } else {
        log.error(`Failed to start batch ${batchId} in station ${stationId}`);
      }
    } catch (err) {
      log.error(
        `Failed to start batch ${batchId} in station ${stationId}. Error: ${err}`
      );
    }

    newBatchDocument["debug"] = {
      data_sent_to_edge_station: [postRequestBody],
    };

    let result = await Mongo.db.collection("batch").insertOne(newBatchDocument);
    if (result.insertedId) {
      res.status(201).json({ ok: true, batchId });
    } else {
      let err = new Error(`Failed to create batch`);
      throw err;
    }
  } catch (err) {
    if (err?.code === "ECONNREFUSED") {
      let address = err.address;
      let port = err.port;
      err = new Error(`Edge station is not reachable`);
      err.code = errors.EDGE_STATION_IS_NOT_REACHABLE;
      err.status = 500;
      if (address && port) {
        err.extraData = { address, port, timeout };
      }
    } else if (err?.code === "ECONNABORTED") {
      let address = err.address;
      let port = err.port;
      err.code = errors.EDGE_STATION_IS_NOT_REACHABLE;
      err.status = 500;
      if (address && port) {
        err.extraData = { address, port, timeout };
      }
    }
    next(err);
  }
}

export default post;
