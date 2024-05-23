import Mongo from "../../../components/mongo";

async function postQueryPipelines(req, res, next) {
  try {
    let name = req.body.name;
    if (!name) {
      res.status(400).json({ ok: false, message: "Name is required" });
      return;
    }
    let document = {
      search_method: "aggregate",
    };
    let queriesDocument = await Mongo.db
      .collection("params")
      .findOne({ name: "queries" });
    let queries = queriesDocument.queries;
    if (queries[name]) {
      res.status(400).json({ ok: false, message: "Name already exists" });
      return;
    } else {
      await Mongo.db
        .collection("params")
        .updateOne(
          { name: "queries" },
          { $set: { [`queries.${name}`]: document } }
        );
      res.status(200).json({ ok: true });
    }
  } catch (err) {
    next(err);
  }
}

export default postQueryPipelines;
