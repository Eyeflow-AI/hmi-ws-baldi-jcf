import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';

async function postDebugEvent(req, res, next) {

  try {
    //TODO
    let eventList = req.body;
    eventList = JSON.stringify(eventList);
    eventList = EJSON.parse(eventList);
    if (!Array.isArray(eventList)) {
      eventList = [eventList];
    }

    const clientIP = req.connection.remoteAddress;
    for (let event of eventList) {
      event.host = clientIP;
    }
    let result = await Mongo.db.collection('debug_events').insertMany(eventList);
    if (result.insertedCount !== eventList.length) {
      let err = new Error(`Failed to insert all debug events`);
      err.status = 500;
      throw err;
    }

    res.status(201).json({
      ok: true
    });
  }
  catch (err) {
    next(err);
  };
};

export default postDebugEvent;