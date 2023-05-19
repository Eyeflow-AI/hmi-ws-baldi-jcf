import Mongo from "../../../components/mongo";

async function get(req, res, next) {

  try {
    let queriesDocument = await Mongo.db.collection("params").findOne({ name: 'queries' });
    if (queriesDocument) {
      let queries = queriesDocument?.queries ?? {};
      Object.keys(queries).forEach((key) => {
        queries[key].feConfig = {
          editable: false,
          deletable: false,
        }
      });
      Object.keys(queriesDocument?.custom_queries ?? {}).forEach((key) => {
        queries[key] = queriesDocument?.custom_queries?.[key];
        queries[key].feConfig = {
          editable: true,
          deletable: true,
        }
      });
      res.status(200).json({ ok: true, result: queries });
    }
    else {
      res.status(200).json({ ok: true, result: [] });
    }

  }
  catch (err) {
    next(err);
  };
};

export default get;