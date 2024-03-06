import Mongo from "../../../components/mongo";

async function getListFromMongo(req, res, next) {
  try {
    let dirPath = req.query.dirPath;
    let host = req.query.host;
    let port = req.query.port;
    let inspectionDate = req.query.inspectionDate;
    let listImages = req.query.listImages;
    let selectedDay = req.query.selectedDay;
    let station = req.query.station;
    
    let docs = [];
    if (dirPath && host && port && inspectionDate) {
      let urlIPV6 = `::ffff:${host.replace('http://', '')}`;
      let urlIPV4 = host.replace('http://', '');
      const collection = Mongo.db.collection('debug_events');

      docs = await collection.find({ host: { $in: [urlIPV4, urlIPV6] }, inspection_date: inspectionDate }).toArray();
    }
    if (!host && !port && listImages && selectedDay && station) {
      const collection = Mongo.db.collection('events');

      docs = await collection.find({
        station: station,
        event_time:
          { $gte: new Date(selectedDay + 'T00:00:00.000Z'), $lt: new Date(selectedDay + 'T23:59:59.000Z') }
      }).toArray();
    }
    res.status(200).json({ ok: true, docs });
  }
  catch (err) {
    next(err);
  }
};

export default getListFromMongo;
