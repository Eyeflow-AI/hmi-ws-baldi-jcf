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
      match = {
        "event_data.window_ini_time": {}
      };
      if (reqQuery.hasOwnProperty("min_event_time")) {
        if (!isIsoDate(reqQuery["min_event_time"])) { raiseError("Invalid min_event_time. Valid iso date is required.") };
        // match.start_time["$gte"] = new Date(reqQuery.min_event_time);
        match['event_data.window_ini_time']['$gte'] = new Date(reqQuery.min_event_time);
      }
      if (reqQuery.hasOwnProperty("max_event_time")) {
        if (!isIsoDate(reqQuery["max_event_time"])) { raiseError("Invalid max_event_time. Valid iso date is required.") };
        // match.start_time["$lte"] = new Date(reqQuery.max_event_time);
        match['event_data.window_ini_time']['$lte'] = new Date(reqQuery.max_event_time);
      };
    };

    for (let key of Object.keys(reqQuery)) {
      if (key.startsWith("query.")) {
        let _key = key.replace("query.", "");
        match[_key] = reqQuery[key];
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
    let dateMatch = getMatch(req.params, req.query);

    let collection = "inspection_events";

    const inspectionIdsList = (await Mongo.db.collection(collection)
      .find(dateMatch)
      // .find()
      .project({ _id: 0, 'event_data.inspection_id': 1 }).toArray() ?? []).map(el => el.event_data.inspection_id);

    // console.dir({ inspectionIdsList }, { depth: null })

    let projection = {
      _id: 0,
      inspection_id: '$_id.inspection_id',
      result: '$_id.result',
      part_id: '$part_id',
      date: '$date',
      count: '$count',
    };
    let sort = { 'date': -1 };
    let limit = 10000;                                          //TODO: Get from config file
    let hashString = '';

    let serialList = await Mongo.db.collection(collection).aggregate([
      {
        $match: {
          'event_data.inspection_id': { $in: inspectionIdsList },
        }
      },
      {
        $group: {
          _id: {
            inspection_id: "$event_data.inspection_id",
            result: "$event_data.inspection_result.ok",
          },
          date: { $first: "$event_data.window_ini_time" },
          part_id: { $first: "$event_data.part_data.id" },
          count: { $sum: 1 },
        }
      },
      { $project: projection },
      { $sort: sort },
      { $limit: limit },
    ], { allowDiskUse: true }).toArray();
    let resultsNotOk = [];

    serialList = serialList.map((el, index) => {
      if (!el.result) {
        resultsNotOk.push(el.inspection_id);
      };
      if (el.result && resultsNotOk.includes(el.inspection_id)) {
        el.toDelete = true;
      }
      return el;
    })
    serialList = serialList.filter(el => !el.toDelete);

    let host = await FeConfigSingleton.getHost('hmi-files-ws');
    let serialListLength = serialList.length;
    serialList.forEach((el, index) => {
      // console.log({ date: el.date })
      hashString += el.date.toISOString();
      el.index = serialListLength - index;
      el.thumbURL = `${host.url}/others/GearIcon.svg`;                 //TODO: Get from config file,
      el.thumbStyle = { height: 90 };                            //TODO: Get from config file,
      el.status = el.result ? "ok" : "ng";
      el.label = el?.part_id?.slice(-5) ?? 'N/A';
      el._id = el.inspection_id;
      el.event_time = el.date;
      hashString += el.status;
      hashString += String(el.count);
    });

    // console.dir({ serialList }, { depth: null })


    let output = {
      ok: true,
      serialListLength,
      serialList,
      hash: hashString ? hashCode(hashString) : null
    };
    if (process.env.NODE_ENV === "development") {
      output.queryOptions = { dateMatch, projection, collection, limit };
    };

    res.status(200).json(output);
  }
  catch (err) {
    next(err);
  };
};

export default getList;