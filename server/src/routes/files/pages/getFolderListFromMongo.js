import Mongo from "../../../components/mongo";

async function getFolderListFromMongo(req, res, next) {
  try {
    let dirPath = req.query.dirPath;
    let host = req.query.host;
    let port = req.query.port;
    if (dirPath && host && port) {
      let url = `::ffff:${host.replace('http://', '')}`;
      const collection = Mongo.db.collection('debug_events');

      let inspectionDates = await collection.find({ host: url }).project({ inspection_date: 1, _id: 0 }).toArray();
      // create a Set from inspectionDates
      inspectionDates = [...new Set(inspectionDates.map(item => item.inspection_date))];
      res.status(200).json({ ok: true, inspectionDates });

    }
  }
  catch (err) {
    next(err);
  }
};

export default getFolderListFromMongo;