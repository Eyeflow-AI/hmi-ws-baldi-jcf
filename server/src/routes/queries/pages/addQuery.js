import Mongo from "../../../components/mongo";

async function addQuery(req, res, next) {

  try {
    let collectionName = req?.body?.collectionName ?? '';
    let searchMethod = req?.body?.searchMethod ?? '';
    let queryName = req?.body?.queryName ?? '';
    let query = req?.body?.query ?? '';
    query = JSON.parse(query);
    if (collectionName && searchMethod && queryName && query) {
      await Mongo.db.collection("params").updateOne({ name: 'queries' }, {
        $set: {
          [`custom_queries.${queryName}`]: {
            collection_name: collectionName,
            search_method: searchMethod,
            restrictionsSet: { ...query },
          }
        }
      }
      )
      res.status(200).json({ ok: true });

    }
    else {
      res.status(400).json({ ok: false, message: 'missing_parameters' });
    }

  }
  catch (err) {
    next(err);
  };
};

export default addQuery;