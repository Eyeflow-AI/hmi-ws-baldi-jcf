import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';

async function postDebugEvent(req, res, next) {

  try {
    //TODO
    let ipv4Address;
    const ipv4Pattern = /::ffff:(\d+\.\d+\.\d+\.\d+)/;
    const clientIP = req.connection.remoteAddress;
    const match = clientIP.match(ipv4Pattern);

    let eventList = req.body;
    eventList = JSON.stringify(eventList);
    eventList = EJSON.parse(eventList);
    if (!Array.isArray(eventList)) {
      eventList = [eventList];
    }

    for (let event of eventList) {
      if (event?.event_host) {
        event.host = event.event_host;
        delete event.event_host;
      }
      else {
        event.host = clientIP;
      }
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