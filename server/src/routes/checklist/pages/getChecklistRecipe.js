import Mongo from "../../../components/mongo";


function buildReference(data) {
  let _ref = [];
  Object.keys(data).forEach(key => {
    if (
      typeof data[key] === 'object'
      && !Array.isArray(data[key])
      && data[key] !== null
      && typeof data[key] !== 'function'
      && typeof data[key] !== 'undefined'
      && Object.keys(data[key]).length >
      0) {
      let newKey = `reference.${key}`;
      Object.keys(data[key]).forEach(subKey => {
        let newSubKey = `${newKey}.${subKey}`;
        if (data[key][subKey] === "EMPTY_FIELD") {
          _ref.push({ [newSubKey]: { $exists: false } });
        }
        else {
          let values = data[key][subKey].split(';');
          values = values.map(value => new RegExp('[;]*' + value.trim() + '[;]*'));
          console.log({ Values: values })
          _ref.push({ [newSubKey]: { $in: values } });
        }
      });
    }
  });
  return _ref;
}

function buildFilters({ schemas, reference }) {

  let _filters = [];
  let _schemas = schemas?.custom_schemas ?? {};
  Object.entries(_schemas).forEach(([refId, data]) => {
    let filter = { ...schemas?.default_schema };
    Object.entries(data).forEach(([key, value]) => {
      Object.entries(value).forEach(([subKey, subValue]) => {
        let ref = subValue && reference?.[key]?.[subKey] ? reference?.[key]?.[subKey] : 'EMPTY_FIELD';
        filter[key][subKey] = ref;
      });
    });
    _filters.push(JSON.parse(JSON.stringify(filter)))
  });


  return _filters;
}

async function getChecklistRecipe(req, res, next) {

  try {
    let reference = req?.query?.variables ?? JSON.stringify({});
    reference = JSON.parse(reference);
    let schemas = await Mongo.db.collection("params").findOne({ name: 'checklist_schemas' });
    let filters = buildFilters({ schemas, reference });
    console.dir({ filters }, { depth: null })

    filters = filters.map(filter => { return { '$and': buildReference(filter) } });
    let recipes = [];
    if (filters.length > 0) {
      recipes = await Mongo.db.collection("checklist").find({ $or: filters }).toArray() ?? [];
    }

    res.status(200).json({ ok: true, recipes });
  }
  catch (err) {
    next(err);
  };
};

export default getChecklistRecipe;