import Mongo from "../../../components/mongo";

async function getChecklistSchemas(req, res, next) {

  try {
    let document = await Mongo.db.collection("params").findOne({
      name: "checklist_schemas"
    }) ?? {};
    res.status(200).json({ ok: true, document });
  }
  catch (err) {
    next(err);
  };
};

export default getChecklistSchemas;