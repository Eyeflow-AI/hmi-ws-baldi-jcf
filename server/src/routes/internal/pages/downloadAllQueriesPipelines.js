import Mongo from "../../../components/mongo";

async function downloadAllQueriesPipelines(req, res, next) {
  try {
    let documents = await Mongo.db
      .collection("queries_pipelines")
      .find({})
      .toArray();
    console.log({ documents });
    res.status(200).json({ ok: true, documents });
  } catch (err) {
    next(err);
  }
}

export default downloadAllQueriesPipelines;
