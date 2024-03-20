import Mongo from "../../../components/mongo";

async function deleteScript(req, res, next) {
  try {
    let name = req.params.name;
    if (!name) {
      res.status(400).json({ ok: false, message: "Name is required" });
      return;
    }
    await Mongo.db.collection("scripts").deleteOne({ name });
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export default deleteScript;
