import Mongo from "../../../components/mongo";
import queryBuilder from "../../../utils/queryBuilder";

async function getData(req, res, next) {

  try {
    let { stationId } = req.params;
    let { startTime, endTime, queryName } = req.query;
    let queriesDocument = await Mongo.db.collection("params").findOne({ name: 'queries' });
    let queryOBJ = {};
    if (stationId && queryName && startTime && endTime && queriesDocument) {
      let queryConstants = queriesDocument?.queries?.[queryName]?.constants ?? {};
      let query = queriesDocument?.queries?.[queryName];
      queryOBJ = queryBuilder({ query, variables: { stationId, startTime, endTime, ...queryConstants } });
      let collectioName = queriesDocument?.queries?.[queryName]?.collection_name;
      let searchMethod = queriesDocument?.queries?.[queryName]?.search_method;
      let result = null;
      if (searchMethod !== 'findOne') {
        result = await Mongo.db.collection(collectioName)[searchMethod](queryOBJ).toArray();
      }
      else {
        result = await Mongo.db.collection(collectioName)[searchMethod](queryOBJ);
      }
      if (query?.functions?.post_function) {
        eval(query?.functions?.post_function);
      }
      res.status(200).json({ ok: true, result, chartInfo: queriesDocument?.queries?.[queryName].chart });
    }


  }
  catch (err) {
    next(err);
  };
};

export default getData;