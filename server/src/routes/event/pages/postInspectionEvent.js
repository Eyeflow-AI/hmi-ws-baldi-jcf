import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';

async function postInspectionEvent(req, res, next) {

  try {
    //TODO
    let event = req.body;
    console.dir({ python: event }, { depth: null })
    event = JSON.stringify(event);
    event = EJSON.parse(event);
    console.dir({ js: event }, { depth: null })

    await Mongo.db.collection('inspection_events').insertOne(event);
    res.status(201).json({
      ok: true
    });
  }
  catch (err) {
    next(err);
  };
};

export default postInspectionEvent;