import Mongo from "../../../components/mongo";

async function putResume(req, res, next) {

  try {
    let stationId = Mongo.ObjectId(req.params.stationId);
    let batchId = Mongo.ObjectId(req.params.batchId);

    let runningBatch = await Mongo.db.collection("batch").findOne({station: stationId, status: "running"});
    if (runningBatch) {
      let err = new Error(`Batch with _id ${runningBatch._id} is already running`);
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