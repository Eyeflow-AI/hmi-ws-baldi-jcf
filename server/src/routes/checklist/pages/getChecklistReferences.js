import Mongo from "../../../components/mongo";

async function getChecklistReferences(req, res, next) {

  try {
    let documents = await Mongo.db.collection("checklist").find({}, {
      projection: {
        _id: 1
      }
    }).toArray() ?? [];
    res.status(200).json({ ok: true, documents });
  }
  catch (err) {
    next(err);
  };
};

export default getChecklistReferences;