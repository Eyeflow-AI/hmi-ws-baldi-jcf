import Mongo from "../../../components/mongo";

async function getListFromMongo(req, res, next) {
  try {
    let dirPath = req.query.dirPath;
    let host = req.query.host;
    let port = req.query.port;
    let inspectionDate = req.query.inspectionDate;
    if (dirPath && host && port && inspectionDate) {

      let urlIPV6 = `::ffff:${host.replace('http://', '')}`;
      let urlIPV4 = host.replace('http://', '');
      const collection = Mongo.db.collection('debug_events');

      let docs = await collection.find({ host: { $in: [urlIPV4, urlIPV6] }, inspection_date: inspectionDate }).toArray();
      // console.log({docs})
      res.status(200).json({ ok: true, docs });

    }
  }
  catch (err) {
    next(err);
  }
};

export default getListFromMongo;