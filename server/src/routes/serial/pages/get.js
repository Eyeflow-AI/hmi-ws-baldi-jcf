import Mongo from "../../../components/mongo";


async function get(req, res, next) {

  try {
    let serialId = req.params.serialId;
    let results = await Mongo.db.collection("inspection_events").find({ 'event_data.inspection_id': serialId }).toArray();
    if (results) {
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
      let err = new Error(`Serial with _id ${serialId} does not exist`);
      err.status = 400;
      throw err;
    }
  }
  catch (err) {
    next(err);
  };
};

export default get;