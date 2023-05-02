import Mongo from "../../../components/mongo";
async function put(req, res, next) {
  try {
    let code = req?.body?.alert_code ?? null;
    let alerts = await Mongo.db.collection('params').findOne({ name: 'alerts' });
    let station_id = req?.body?.station_id ?? null;

    if (Number.isInteger(code) && alerts?.alerts?.[code] && station_id) {
      let alert = alerts.alerts[code];
      await Mongo.db.collection('alert').updateOne({
        station_id: Mongo.ObjectId(station_id)
      }, {
        $set: {
          alert,
          date: new Date(),
        }
      }, {
        upsert: true
      });
      res.status(200).json({ ok: true, msg: 'alert inserted', alert });
    }
    else {
      res.status(204).json('No alert registered or invalid code or station_id');
    }
  }
  catch (err) {
    console.log({ err })
    res.status(204).json({ msg: 'could not communicate' })
  }
};

export default put;