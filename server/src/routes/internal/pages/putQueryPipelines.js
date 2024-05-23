import Mongo from "../../../components/mongo";

async function putQueryPipelines(req, res, next) {
  try {
    let document = req.body.document;
    if (!document) {
      res.status(400).json({ ok: false, message: "Document is required" });
      return;
    }
    let name = structuredClone(document.name);
    delete document.name;
    document.document.search_method = "aggregate";
    await Mongo.db
      .collection("params")
      .updateOne(
        { name: "queries" },
        { $set: { [`queries.${name}`]: document.document } }
      );
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export default putQueryPipelines;
