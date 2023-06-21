import Mongo from "../../../components/mongo";
async function _delete(req, res, next) {
  try {
    let station_id = req?.params?.stationId ?? null;
    if (station_id) {
      await Mongo.db.collection('alert').deleteOne({ station_id: new Mongo.ObjectId(station_id) });
      res.status(200).json('alert deleted');
    }
    else {
      res.status(400).json('No station_id');
    }
  }
  catch (err) {
    console.log({ err })
    res.status(204).json({ msg: 'could not communicate' })
  }
};

export default _delete;