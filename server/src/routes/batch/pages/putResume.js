import Mongo from "../../../components/mongo";

async function putResume(req, res, next) {

  try {
    // let stationId = req.params.stationId;
    let batchId = req.params.batchId;
    let result = await Mongo.db.collection("batch").updateOne(
      {_id: Mongo.ObjectId(batchId), status: "paused"},
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