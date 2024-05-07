import Mongo from "../../../components/mongo";

async function getQueriesPipelines(req, res, next) {
  try {
    let documents =
      (await Mongo.db
        .collection("queries_pipelines")
        .find(
          {},
          {
            projection: {
              _id: 0,
              name: 1,
            },
          }
        )
        .toArray()) ?? [];
    res.status(200).json({ ok: true, documents });
  } catch (err) {
    next(err);
  }
}

export default getQueriesPipelines;
