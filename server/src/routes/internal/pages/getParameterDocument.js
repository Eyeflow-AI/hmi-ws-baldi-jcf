import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';

async function getParameterDocument(req, res, next) {

  try {
    let name = req.query.name;
    let document = await Mongo.db.collection("params").findOne({
      name
    });
    document = EJSON.stringify(document);
    document = JSON.parse(document);
    res.status(200).json({ ok: true, document });

  }
  catch (err) {
    next(err);
  };
};

export default getParameterDocument;