import Mongo from "../../../components/mongo";

async function getChecklistRegions(req, res, next) {

  try {
    let id = req?.params?.id ?? '';
    let checklist = await Mongo.db.collection("checklist").findOne({
      _id: new Mongo.ObjectId(id)
    }) ?? {};
    res.status(200).json({ ok: true, checklist });
  }
  catch (err) {
    next(err);
  };
};

export default getChecklistRegions;