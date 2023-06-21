const crypto = require('crypto');
import Mongo from "../../../components/mongo";


async function get(req, res, next) {
  try {
    let station_id = req.params.stationId;
    let alerts = await Mongo.db.collection('alert').find({ station_id: Mongo.ObjectId(station_id), active: true }).toArray();
    let alertsHash = "";
    alerts.forEach(alert => {
      alertsHash += alert._id.toString() + alert.date.toString();
    });
    alertsHash = crypto.createHash('md5').update(alertsHash).digest('hex');
    res.status(200).json({ok: true, alerts, alertsHash});
  }
  catch (err) {
    next(err);
  }
};

export default get;