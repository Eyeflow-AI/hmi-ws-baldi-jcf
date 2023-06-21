import Mongo from "../../../components/mongo";


const deleteVariableType = (reference) => {

  let _reference = { ...reference };

  Object.entries(_reference).forEach(([key, value]) => {
    if (!value || !Object.keys(value).length) {
      delete _reference[key];
    }
  })

  return _reference;
}


const deleteInternalReferences = (reference) => {

  let _reference = { ...reference };

  Object.entries(_reference).forEach(([key, value]) => {
    Object.entries(value).forEach(([k, v]) => {
      if (!v) {
        delete _reference[key][k];
      }
    })
  })

  return _reference;
}

const createConstraints = (reference) => {
  let _reference = { ...reference };

  Object.entries(_reference).forEach(([key, value]) => {
    Object.entries(value).forEach(([k, v]) => {
      _reference[key][k] = Boolean(v);
    })
  })

  return _reference;

}


async function putChecklistReference(req, res, next) {

  try {
    let { _id, reference } = req.body;
    reference = deleteInternalReferences(reference);
    reference = deleteVariableType(reference);
    let updated = await Mongo.db.collection("checklist").updateOne({
      _id: new Mongo.ObjectId(_id)
    }, {
      $set: {
        reference
      }
    });
    if (updated?.modifiedCount === 1) {
      let constraints = createConstraints(reference);
      await Mongo.db.collection("params").updateOne({ name: 'checklist_schemas' }, {
        $set: {
          [`custom_schemas.${_id}`]: constraints
        }
      }, { upsert: true });
      res.status(200).json({ ok: true });
    }
    else {
      throw new Error('Error updating checklist reference');
    }
  }
  catch (err) {
    next(err);
  };
};

export default putChecklistReference;