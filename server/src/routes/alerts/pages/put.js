import Mongo from "../../../components/mongo";


async function put(req, res, next) {
  try {
    let code = req.body.alert_code ?? null;
    if (!Number.isInteger(code)) {
      let err = new Error(`body parm alert_code is required and should be a valid int value`);
      err.status = 400;
      throw err;
    };

    let alertsDocument = await Mongo.db.collection('params').findOne({ name: 'alerts' });
    if (!alertsDocument) {
      let err = new Error(`Could not find alerts document`);
      throw err;
    };

    let station_id = req.params.stationId;

    if (alertsDocument?.alerts?.hasOwnProperty(code)) {
      let alert = alertsDocument.alerts[code];
      let result = await Mongo.db.collection('alert').updateOne(
        {station_id: Mongo.ObjectId(station_id)},
        {
          $set: {
            alert,
            date: new Date(),
          }
        }, {
          upsert: true
        }
      );
      res.status(200).json({ ok: true, msg: 'alert updated', alert });
    }
    else {
      let err = new Error(`Could not find alert with code ${code}`);
      err.status = 400;
      throw err;
    }
  }
  catch (err) {
    next(err);
  }
};

export default put;