import Mongo from "../../../components/mongo";

async function getQueriesPipelinesDocument(req, res, next) {
  try {
    let name = req.params.name;
    let queriesDocument = await Mongo.db
      .collection("params")
      .findOne({ name: "queries" });
    if (!queriesDocument) {
      queriesDocument = {};
    }
    let document = queriesDocument?.queries?.[name] ?? {};

    res.status(200).json({ ok: true, document });
  } catch (err) {
    next(err);
  }
}

export default getQueriesPipelinesDocument;
