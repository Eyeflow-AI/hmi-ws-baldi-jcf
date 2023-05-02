import Mongo from "../../../components/mongo";
async function get(req, res, next) {
  try {
    let station_id = req?.params?.stationId ?? null;
    if (station_id) {
      let alert = await Mongo.db.collection('alert').findOne({ station_id: Mongo.ObjectId(station_id) }) ?? null;
      if (alert) {
        res.status(200).json(alert);
      }
      else {
        res.status(204).json('no active alert');
      }
    }
    else {
      res.status(204).json('No station_id');
    }

  }
  catch (err) {
    console.log({ err })
    res.status(204).json({ msg: 'could not communicate' })
  }
};

export default get;