import Mongo from "../../../components/mongo";

async function getFolderListFromMongo(req, res, next) {
  try {
    let host = req.query.host;

    if (!host) {
      let err = new Error(`query.host is required`);
      err.status = 400;
      throw err;
    }

    let url = `::ffff:${host.replace('http://', '')}`;
    let inspectionDates = await Mongo.db.collection('debug_events').distinct('inspection_date', { host: url });
    res.status(200).json({ ok: true, inspectionDates });
  }
  catch (err) {
    next(err);
  }
};

export default getFolderListFromMongo;