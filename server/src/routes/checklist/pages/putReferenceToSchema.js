import Mongo from "../../../components/mongo";


async function putChecklistReference(req, res, next) {

  try {
    let { referenceType, referenceName } = req.body;
    await Mongo.db.collection("params").updateOne({
      name: 'checklist_schemas'
    }, {
      $set: {
        [`default_schema.${referenceType}.${referenceName}`]: 'EMPTY_FIELD'
      }
    });
    res.status(200).json({ ok: true });

  }
  catch (err) {
    next(err);
  };
};

export default putChecklistReference;