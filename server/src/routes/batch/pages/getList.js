import Mongo from "../../../components/mongo";
import isIsoDate from "../../../utils/isIsoDate";
import hashCode from "../../../utils/hashCode";
import FeConfigSingleton from "../../../components/FeConfigSingleton";

function raiseError(message) {
  let err = new Error(message);
  err.status = 400;
  throw err;
};

function getMatch(reqParams, reqQuery) {

  let match = {};

  if (Boolean(reqQuery) && Object.keys(reqQuery).length > 0) {

    if (reqQuery.hasOwnProperty("min_event_time") || reqQuery.hasOwnProperty("max_event_time")) {
      match.start_time = {};
      if (reqQuery.hasOwnProperty("min_event_time")) {
        if (!isIsoDate(reqQuery["min_event_time"])) { raiseError("Invalid min_event_time. Valid iso date is required.") };
        match.start_time["$gte"] = new Date(reqQuery.min_event_time);
      }
      if (reqQuery.hasOwnProperty("max_event_time")) {
        if (!isIsoDate(reqQuery["max_event_time"])) { raiseError("Invalid max_event_time. Valid iso date is required.") };
        match.start_time["$lte"] = new Date(reqQuery.max_event_time);
      };
    };

    for (let key of Object.keys(reqQuery)) {
      if (key.startsWith("info.")) {
        match[key] = reqQuery[key];
      }
    }

    if (!Mongo.ObjectId.isValid(reqParams["stationId"])) { raiseError(`Invalid station ${reqParams["stationId"]}. Valid ObjectId is required.`) }

    match.station = new Mongo.ObjectId(reqParams["stationId"]);
  };

  return match;
};

/**
* @param {string} [query.min_event_time] - min event time - Iso String Date.
* @param {string} [query.max_event_time] - max event time - Iso String Date.
* @param {string} [query.station] - station - String ObjectId.
*/
async function getList(req, res, next) {

  try {
    let match = getMatch(req.params, req.query);
    let projection = {
      _id: true,
      id: true,
      label: "$info.production_order",
      start_time: true,
      end_time: true,
      station: true,
      status: true,
    };

    let collection = "batch";
    let limit = 10000;                                          //TODO: Get from config file
    let sort = { start_time: -1 };
    let hashString;
    let batchList = await Mongo.db.collection(collection).find(match, { projection }).sort(sort).limit(limit).toArray();
    let host = await FeConfigSingleton.getHost("hmi-files-ws");

    let batchListLength = batchList.length;
    batchList.forEach((el, index) => {
      hashString += el.start_time.toISOString();
      hashString += el.status;
      el.index = batchListLength - index;
      // el.thumbURL = `${host.url}/others/PerfumeIcon.svg`;                 //TODO: Get from config file,
      el.thumbStyle = { height: 70 };                            //TODO: Get from config file,
    });

    let output = {
      ok: true,
      batchListLength,
      batchList,
      hash: hashString ? hashCode(hashString) : null
    };
    if (process.env.NODE_ENV === "development") {
      output.queryOptions = { match, projection, collection, limit };
    };

    res.status(200).json(output);
  }
  catch (err) {
    next(err);
  };
};

export default getList;