import Mongo from "../../../components/mongo";

async function getFolderListFromMongo(req, res, next) {
  try {
    let host = req.query.host;

    if (!host) {
      let err = new Error(`query.host is required`);
      err.status = 400;
      throw err;
    }

    let urlIPV6 = `::ffff:${host.replace('http://', '')}`;
    let urlIPV4 = host.replace('http://', '');
    let inspectionDates = await Mongo.db.collection('debug_events').distinct('inspection_date', { host: { $in: [urlIPV4, urlIPV6] } });
    // console.log({inspectionDates})
    res.status(200).json({ ok: true, inspectionDates });
  }
  catch (err) {
    next(err);
  }
};

export default getFolderListFromMongo;