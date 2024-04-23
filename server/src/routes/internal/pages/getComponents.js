import Mongo from "../../../components/mongo";

async function getComponents(req, res, next) {
  try {
    let documents =
      (await Mongo.db
        .collection("components")
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

export default getComponents;
