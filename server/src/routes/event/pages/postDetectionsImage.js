import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';

async function postDetectionsImage(req, res, next) {

  try {
    //TODO
    let event = req.body;
    event = JSON.stringify(event);
    event = EJSON.parse(event);

    const clientIP = req.connection.remoteAddress;
    let info = event[Object.keys(event)[0]];
    let _id = new ObjectId(Object.keys(event)[0]);
    delete event[Object.keys(event)[0]];
    event._id = _id;
    event.host = clientIP;
    event.info = info;

    await Mongo.db.collection('image_detections').insertOne(event);
    res.status(201).json({
      ok: true
    });
  }
  catch (err) {
    next(err);
  };
};

export default postDetectionsImage;