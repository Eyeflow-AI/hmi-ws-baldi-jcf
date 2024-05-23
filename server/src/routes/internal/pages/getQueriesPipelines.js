import Mongo from "../../../components/mongo";

async function getQueriesPipelines(req, res, next) {
  try {
    let documents = await Mongo.db
      .collection("params")
      .findOne({ name: "queries" });
    if (!documents) {
      documents = {};
    }
    documents = documents?.queries ?? {};
    documents = Object.keys(documents).map((name) => ({ name })) ?? [];
    res.status(200).json({ ok: true, documents });
  } catch (err) {
    next(err);
  }
}

export default getQueriesPipelines;
