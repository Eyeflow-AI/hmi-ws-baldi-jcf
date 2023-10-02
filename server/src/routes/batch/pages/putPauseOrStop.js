import Mongo from "../../../components/mongo";
import consolidateBatch from "../../../utils/consolidateBatch";
import log from "../../../utils/log";
import lodash from "lodash";

const axios = require('axios');


async function putPauseOrStop(req, res, next) {

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

    let isRunning = Boolean(await Mongo.db.collection("batch").findOne({ _id: batchId, status: "running" }));
    if (!isRunning) {
      let err = new Error(`Batch with _id ${batchId} is not running`);
      err.status = 400;
      throw err;
    };

    let postRequestBody = {
      batch: {
        status: "stop_batch",
      },
    };

    postRequestBody.env_var = lodash.cloneDeep(postRequestBody);
    try {
      // TODO: Try again on fail. Maybe use a queue?
      let response = await axios.post(postBatchURL, postRequestBody, { timeout });
      if (![200, 201].includes(response.status)) {
        log.info(`Successfully paused batch ${batchId} in station ${stationId}`);
      }
      else {
        log.error(`Failed to pause batch ${batchId} in station ${stationId}`);
      }
    }
    catch (err) {
      log.error(`Failed to pause batch ${batchId} in station ${stationId}. Error: ${err}`);
    }

    let batchStatus;
    if (req.path.includes("pause")) {
      batchStatus = "paused";
    }
    else {
      batchStatus = "stopped";
    }

    let result = await consolidateBatch(batchId, batchStatus);

    if (result) {
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

export default putPauseOrStop;