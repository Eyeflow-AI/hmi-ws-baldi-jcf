import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';

async function putParameterDocument(req, res, next) {

  try {
    let document = EJSON.stringify(req.body.document);
    document = EJSON.parse(document);
    delete document._id;
    if (['feConfig', 'locale'].includes(document.name)) {
      document.datetime = new Date();
    }
    let result = await Mongo.db.collection("params").replaceOne({
      name: document.name
    }, { ...document });
    res.status(200).json({ ok: true });

  }
  catch (err) {
    next(err);
  };
};

export default putParameterDocument;