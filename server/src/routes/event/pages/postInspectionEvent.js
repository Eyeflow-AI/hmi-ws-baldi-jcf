import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';

async function postInspectionEvent(req, res, next) {

  try {
    let event = req.body;
    event = JSON.stringify(event);
    event = EJSON.parse(event);

    await Mongo.db.collection('inspection_events').insertOne(event);
    await Mongo.db.collection('staging_events').deleteMany({ 'event_data.inspection_id': event.event_data.inspection_id });
    res.status(201).json({
      ok: true
    });
  }
  catch (err) {
    next(err);
  };
};

export default postInspectionEvent;