import Mongo from "../../../components/mongo";

async function putPause(req, res, next) {

  try {
    // let stationId = req.params.stationId;
    let serialId = req.params.serialId;
    let result = await Mongo.db.collection("batch").updateOne(
      { _id: Mongo.ObjectId(serialId), status: "running" },
      { $set: { status: "paused" } }
    );
    if (result.modifiedCount === 1) {
      res.status(200).json({ ok: true });
    }
    else {
      let err = new Error(`Could not update batch ${serialId}`);
      err.status = 400;
      throw err;
    }
  }
  catch (err) {
    next(err);
  };
};

export default putPause;