import Mongo from "../../../components/mongo";
import queryBuilder from "../../../utils/queryBuilder";

async function getData(req, res, next) {

  try {
    let { stationId } = req.params;
    let { startTime, endTime, queryName } = req.query;
    console.log({ stationId, startTime, endTime, queryName })
    let queriesDocument = await Mongo.db.collection("params").findOne({ name: 'queries' });
    let queryOBJ = {};
    if (stationId && queryName && startTime && endTime && queriesDocument) {
      queryOBJ = queryBuilder({ query: queriesDocument?.queries?.[queryName], variables: { stationId, startTime, endTime } });
      let collectioName = queriesDocument?.queries?.[queryName]?.collection_name;
      let searchMethod = queriesDocument?.queries?.[queryName]?.search_method;
      let result = null;
      if (searchMethod !== 'findOne') {
        result = await Mongo.db.collection(collectioName)[searchMethod](queryOBJ).toArray();
      }
      else {
        result = await Mongo.db.collection(collectioName)[searchMethod](queryOBJ);
      }
      res.status(200).json({ ok: true, result, chartInfo: queriesDocument?.queries?.[queryName].chart });
    }


  }
  catch (err) {
    next(err);
  };
};

export default getData;