import Mongo from "../../../components/mongo";


async function get(req, res, next) {

  try {
    let serialId = req.params.serialId;
    let collection = req?.query?.collection ?? "inspection_events";
    let results = await Mongo.db.collection(collection).find({ 'event_data.inspection_id': serialId }).toArray();
    if (results.length > 0) {
      if (collection === 'staging_events') {
        results = [results[results.length - 1]];
      };
      let inspectionsBuckets = {};
      results.forEach(result => {
        let bucket = result.view;
        if (!inspectionsBuckets[bucket]) {
          inspectionsBuckets[bucket] = [];
        }
        inspectionsBuckets[bucket].push(result);
      });
      res.status(200).json({
        ok: true, serial: {
          _id: serialId,
          info: {
            inspection_id: serialId,
            part_data: results[0].event_data.part_data
          },
          documentsCount: results.length,
          // documents: results
          inspectionsBuckets
        }
      });
    }
    else {
      res.status(204).json({ ok: false, msg: 'No results' });
    }
  }
  catch (err) {
    next(err);
  };
};

export default get;