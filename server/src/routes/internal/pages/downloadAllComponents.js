import Mongo from "../../../components/mongo";

async function downloadAllComponents(req, res, next) {
  try {
    let documents = await Mongo.db.collection("components").find().toArray();
    res.status(200).json({ ok: true, documents });
  } catch (err) {
    next(err);
  }
}

export default downloadAllComponents;
