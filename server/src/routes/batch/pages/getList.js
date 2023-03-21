import Mongo from "../../../components/mongo";
import isIsoDate from "../../../utils/isIsoDate";
import hashCode from "../../../utils/hashCode";

function raiseError(message) {
  let err = new Error(message);
  err.status = 400;
  throw err;
};

function getMatch(reqQuery) {

  let match = {};

  if (Boolean(reqQuery) && Object.keys(reqQuery).length > 0) {

    if (reqQuery.hasOwnProperty("min_event_time") || reqQuery.hasOwnProperty("max_event_time")) {
      match.startTime = {};
      if (reqQuery.hasOwnProperty("min_event_time")) {
        if (!isIsoDate(reqQuery["min_event_time"])) {raiseError("Invalid min_event_time . Valid iso date is required.")};
        match.startTime["$gte"] = new Date(reqQuery.min_event_time);
      }
      if (reqQuery.hasOwnProperty("max_event_time")) {
        if (!isIsoDate(reqQuery["max_event_time"])) {raiseError("Invalid max_event_time . Valid iso date is required.")};
        match.startTime["$lte"] = new Date(reqQuery.max_event_time);
      };
    };

  };

  return match;
};

/**
* @param {string} [query.min_event_time] - min event time - Iso String Date.
* @param {string} [query.max_event_time] - max event time - Iso String Date.
*/
async function getList(req, res, next) {

  try {
    let match = getMatch(req.query);
    let projection = {
      _id: true,
      id: true,
      label: true,
      startTime: true,
      endTime: true,
    //   status: {
    //     "$cond": [
    //       "$event_data.inspection_result.conformity",
    //       "ok", 
    //       "nok"
    //     ]
    //   },                                                       //TODO implement repaired and unidentified logic
      thumbURL: "/assets/ItemButtonImage.svg"                  //TODO: Get from config file
    };
    let collection = "batch";                      //TODO: Get from config file
    let limit = 10000;                                         //TODO: Get from config file
    let sort = {startTime: -1};                               //TODO: Get from config file
    let dateString;
    let eventList = await Mongo.db.collection(collection).find(match, {projection}).sort(sort).limit(limit).toArray();
    let eventListLength = eventList.length;
    eventList.forEach((el, index) => {
      dateString += el.startTime.toISOString();
      el.index = eventListLength - index;
    });

    let output = {
      ok: true,
      eventListLength,
      eventList,
      hash: dateString ? hashCode(dateString) : null
    };
    if (process.env.NODE_ENV === "development") {
      output.queryOptions = {match, projection, collection, limit};
    };

    res.status(200).json(output);
  }
  catch (err) {
    next(err);
  };
};

export default getList;