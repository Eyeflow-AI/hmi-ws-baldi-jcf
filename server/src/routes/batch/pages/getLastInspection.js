import Mongo from "../../../components/mongo";

async function getLastInspection(req, res, next) {
  try {
    // let batchId = req.params.batchId;
    // queryParams = ?client=xx&internal_code=xxx&event_time=yyyy-mm-dd
    let queryParams = req.query;
    let query = {
      event_data: {},
    };
    if (queryParams.event_time) {
      query.event_time = new Date(queryParams.event_time);
      delete queryParams.event_time;
    }
    query.event_data = queryParams;

    let result = await Mongo.db
      .collection("events")
      .findOne(query, { sort: { event_time: -1 } });
    if (result) {
      res.status(200).json({ ok: true, event: result });
    } else {
      let err = new Error(
        `Event with query ${JSON.stringify(query)} does not exist`
      );
      err.status = 400;
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

export default getLastInspection;
