import Mongo from "../../../components/mongo";


async function get(req, res, next) {
  try {
    let station_id = req.params.stationId;
    let alerts = await Mongo.db.collection('alert').find({ station_id: Mongo.ObjectId(station_id), active: true }).toArray();
    res.status(200).json({ok: true, alerts});
  }
  catch (err) {
    next(err);
  }
};

export default get;