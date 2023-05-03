import Mongo from "../../../components/mongo";

async function get(req, res, next) {

  try {
    let serialId = req.params.serialId;
    let result = await Mongo.db.collection("inspection_events").find({ 'event_data.info.inspection_id': serialId }).toArray();
    if (result) {
      res.status(200).json({
        ok: true, serial: {
          _id: serialId,
          info: {
            inspection_id: serialId,
            part_id: result[0].event_data.part_data.part_id,
          },
          documentsCount: result.length,
          documents: result
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