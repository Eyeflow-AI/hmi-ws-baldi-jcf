import Mongo from "../../../components/mongo";


async function post(req, res, next) {
  try {
    let code = req?.body?.alert_code ?? null;
    let station_id = req?.params?.stationId ?? null;
    let alerts = await Mongo.db.collection('params').findOne({ name: 'alerts' });

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
    next(err);
  }
};

export default post;