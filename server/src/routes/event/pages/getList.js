import Mongo from "../../../components/mongo";


function getMatch(reqQuery) {

  let match = {};
  if (Boolean(reqQuery) && Object.keys(reqQuery).length > 0) {
    if (reqQuery.hasOwnProperty("min_event_time") || reqQuery.hasOwnProperty("max_event_time")) {
      match.event_time = {};
      if (reqQuery.hasOwnProperty("min_event_time")) {
        match.event_time["$gte"] = new Date(reqQuery.min_event_time);
      }
      if (reqQuery.hasOwnProperty("max_event_time")) {
        match.event_time["$lte"] = new Date(reqQuery.min_event_time);
      }
    }
  }

  return match;
};

async function getList(req, res, next) {

  try {
    let match = getMatch(req.query);
    let projection = {
      _id: true,
      id: { $substr: [ "$event_data.car_data.vin", 11, -1 ] },
      event_time: true,
      status: {
        "$cond": [
          "$event_data.inspection_result.conformity",
          "ok", 
          "nok"
        ]
      },                                      //TODO implement repaired and unidentified logic
      thumbURL: "/assets/ItemButtonImage.svg" //TODO: Get from config file
    };
    let collection = "inspection_events";     //TODO: Get from config file
    let limit = 10000;                        //TODO: Get from config file
    let eventList = await Mongo.db.collection(collection).find(match, {projection}).limit(limit).toArray();

    let output = {ok: true, eventListLength: eventList.length, eventList};
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