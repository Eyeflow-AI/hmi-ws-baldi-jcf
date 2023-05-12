import axios from "axios";

import Mongo from "../../../components/mongo";
import getPartData from "../../../utils/getPartData";
import parseIntThrowError from "../../../utils/parseIntThrowError";

async function putResume(req, res, next) {

  try {
    let stationId = Mongo.ObjectId(req.params.stationId);
    let batchId = Mongo.ObjectId(req.params.batchId);

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

    let runningBatch = await Mongo.db.collection("batch").findOne({station: stationId, status: "running"});
    if (runningBatch) {
      let err = new Error(`Batch with _id ${runningBatch._id} is already running`);
      err.status = 400;
      throw err;
    };

    let batchDocument = await Mongo.db.collection("batch").findOne({_id: batchId});
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
        status: "new_batch", //TODO: should be "resume_batch"
        total_packs: parseIntThrowError(batchDocument.info.total_packs, `Failed to parse batchDocument.info.total_packs ${batchDocument.info.total_packs} as integer`),
        parts_per_pack: parseIntThrowError(batchDocument.info.total_packs, `Failed to parse batchDocument.info.parts_per_pack ${batchDocument.info.parts_per_pack} as integer`),
        profile_parms: partData.color_profile
      },
    };

    let response = await axios.post(postBatchURL, postRequestBody, { timeout: 1000 });
    if (response.status !== 201) {
      let err = new Error(`Failed to create batch. Edge station responded with status ${response.status}`);
      err.status = 400;
      throw err;
    };

    let result = await Mongo.db.collection("batch").updateOne(
      {_id: batchId, status: "paused"},
      {$set: {status: "running"}}
    );
    if (result.modifiedCount === 1) {
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

export default putResume;