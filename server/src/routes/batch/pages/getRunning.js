import Mongo from "../../../components/mongo";

async function getRunning(req, res, next) {

  try {
    let stationId = req.params.stationId;
    let projection = {
      _id: true,
      id: true,
      label: true,
      start_time: true,
      end_time: true,
      station: true,
      status: true,
    };
    if (!Mongo.ObjectId.isValid(stationId)) {
      let err = new Error(`${stationId} is not a valid station id`);
      err.status = 400;
      throw err;
    };
    let result = await Mongo.db.collection("batch").findOne({station: Mongo.ObjectId(stationId), status: "running"}, {projection});
    res.status(200).json({ok: true, batch: result ?? null});
  }
  catch (err) {
    next(err);
  };
};

export default getRunning;