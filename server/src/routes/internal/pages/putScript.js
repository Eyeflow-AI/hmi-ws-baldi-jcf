import Mongo from "../../../components/mongo";

async function putScript(req, res, next) {
  try {
    let document = req.body.document;
    if (!document) {
      res.status(400).json({ ok: false, message: "Document is required" });
      return;
    }
    await Mongo.db
      .collection("scripts")
      .updateOne(
        { name: document.name },
        { $set: { document: document.document } },
        { upsert: true }
      );
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export default putScript;
