import Mongo from "../../../components/mongo";
import consolidateBatch from "../../../utils/consolidateBatch";
import log from "../../../utils/log";

const axios = require('axios');


async function putPause(req, res, next) {

  try {
    let stationId = Mongo.ObjectId(req.params.stationId);
    let batchId = Mongo.ObjectId(req.params.batchId);

    let stationDocument = await Mongo.db.collection("station").findOne({_id: stationId});
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

    let isRunning = Boolean(await Mongo.db.collection("batch").findOne(  {_id: batchId, status: "running"}));
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

    try {
      // TODO: Try again on fail. Maybe use a queue?
      let response = await axios.post(postBatchURL, postRequestBody, {timeout: 1000});
      if (response.status !== 201) {
        log.info(`Successfully paused batch ${batchId} in station ${stationId}`);
      }
      else {
        log.error(`Failed to pause batch ${batchId} in station ${stationId}`);
      }
    }
    catch (err) {
      log.error(`Failed to pause batch ${batchId} in station ${stationId}. Error: ${err}`);
    }

    let result = await consolidateBatch(batchId, "paused");

    if (result) {
      res.status(200).json({ok: true});
    }
    else {
      let err = new Error(`Could not update batch ${batchId}`);
      err.status = 400;
      throw err;
    }
  }
  catch (err) {
    next(err);
  };
};

export default putPause;