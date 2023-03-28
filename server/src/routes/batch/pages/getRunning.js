import Mongo from "../../../components/mongo";

async function getRunning(req, res, next) {

  try {
    let stationId = req.params.stationId;
    if (!Mongo.ObjectId.isValid(stationId)) {
      let err = new Error(`${stationId} is not a valid station id`);
      err.status = 400;
      throw err;
    };
    let result = await Mongo.db.collection("batch").findOne({station: Mongo.ObjectId(stationId), status: "running"})
    res.status(200).json({ok: true, batch: result ?? null});
  }
  catch (err) {
    next(err);
  };
};

export default getRunning;