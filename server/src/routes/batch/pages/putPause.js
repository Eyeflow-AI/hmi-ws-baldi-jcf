import Mongo from "../../../components/mongo";
import consolidateBatch from "../../../utils/consolidateBatch";


async function putPause(req, res, next) {

  try {
    // let stationId = req.params.stationId;
    let batchId = Mongo.ObjectId(req.params.batchId);

    let isRunning = Boolean(await Mongo.db.collection("batch").findOne(  {_id: batchId, status: "running"}));
    if (!isRunning) {
      let err = new Error(`Batch with _id ${batchId} is not running`);
      err.status = 400;
      throw err;
    };

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