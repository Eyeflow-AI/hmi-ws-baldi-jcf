import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';

async function postInspectionEvent(req, res, next) {

  try {
    //TODO
    let ipv4Address;
    const ipv4Pattern = /::ffff:(\d+\.\d+\.\d+\.\d+)/;
    const clientIP = req.connection.remoteAddress;
    const match = clientIP.match(ipv4Pattern);

    let event = req.body;
    event = JSON.stringify(event);
    event = EJSON.parse(event);
    if (event?.event_host) {
      event.host = event.event_host;
      ipv4Address = event.event_host;
      delete event.event_host;
    }
    else {
      event.host = clientIP;
      if (match && match.length >= 2) {
        ipv4Address = match[1];
        console.log("IPv4 address:", ipv4Address);
      } else {
        console.log("No IPv4 address found.");
      }
    }


    await Mongo.db.collection('staging_events').insertOne(event);
    res.status(201).json({
      ok: true
    });
  }
  catch (err) {
    next(err);
  };
};

export default postInspectionEvent;