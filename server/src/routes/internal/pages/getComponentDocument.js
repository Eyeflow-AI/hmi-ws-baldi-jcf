import Mongo from "../../../components/mongo";

async function getComponentDocument(req, res, next) {
  try {
    let name = req.params.name;
    let document =
      (await Mongo.db.collection("components").findOne(
        { name },
        {
          projection: {
            _id: 0,
            name: 1,
            document: 1,
          },
        }
      )) ?? {};

    res.status(200).json({ ok: true, document });
  } catch (err) {
    next(err);
  }
}

export default getComponentDocument;
