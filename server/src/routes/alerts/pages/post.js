import Mongo from "../../../components/mongo";


async function post(req, res, next) {
  try {
    let station_id = req.params.stationId;
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

    if (!alertsDocument?.alerts?.hasOwnProperty(code)) {
      let err = new Error(`Could not find alert with code ${code}`);
      err.status = 400;
      throw err;
    };

    let newAlertDocument = {
      date: new Date(),
      active: true,
      station_id: new Mongo.ObjectId(station_id),
      alert: alertsDocument.alerts[code],
    }

    let result = await Mongo.db.collection('alert').insertOne(newAlertDocument);
    if (result.acknowledged && result.insertedId) {
      res.status(200).json({ ok: true, msg: 'alert inserted', alert: newAlertDocument });
    }
    else {
      let err = new Error(`Could not insert alert`);
      throw err;
    };
  }
  catch (err) {
    if (err.message.includes('E11000')) {
      err.message = `Document with this station already exists`;
    }
    next(err);
  }
};

export default post;