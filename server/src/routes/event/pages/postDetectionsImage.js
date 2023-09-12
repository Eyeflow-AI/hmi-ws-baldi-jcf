import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';

async function postDetectionsImage(req, res, next) {

  try {
    let event = req.body;
    event = JSON.stringify(event);
    event = EJSON.parse(event);

    const clientIP = req.connection.remoteAddress;
    let _id = new ObjectId(event.image_id);
    delete event['image_id'];
    event._id = _id;
    event.host = clientIP;

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