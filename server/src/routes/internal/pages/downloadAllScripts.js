import Mongo from "../../../components/mongo";

async function downloadAllScripts(req, res, next) {
  try {
    let documents = await Mongo.db.collection("scripts").find().toArray();
    res.status(200).json({ ok: true, documents });
  } catch (err) {
    next(err);
  }
}

export default downloadAllScripts;
