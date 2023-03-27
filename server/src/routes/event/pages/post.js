const Mongo = require("../../../components/mongo");
const isJson = require("../../../utils/isJson");
const fixJson = require("../../../utils/fixJson");

// {
//   event: {
//     _id: str, Optional
//     type: str, Required
//     station: str, Required
//     event_time: date, Optional
//     event_data: json com as detecções, required
//     version: 1, Optional
//    }
// }

function raiseError(message) {
  let err = new Error(message);
  err.status = 400;
  throw err;
};

var isDate = function(date) {
  return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
};

function checkBodyAndBuildEvent(reqBody) {

  if (!Boolean(reqBody))                                                                   {raiseError(`Missing Request body`)};

  if (typeof(reqBody) === "string") {
    if (isJson(reqBody)) {
      reqBody = JSON.parse(reqBody);
    }
    else {
      raiseError(`Invalid request body. Request body is a not a valid json object`);
    }
  };

  try {
    reqBody = fixJson(reqBody);
  }
  catch(err) {
    raiseError(err.message);
  };

  if (!reqBody.hasOwnProperty("event"))                                                    {raiseError(`Invalid request body. Missing event key`)};
  if (reqBody.event.hasOwnProperty("_id") && !Mongo.ObjectId.isValid(reqBody.event._id))   {raiseError(`Invalid request body. event._id ${reqBody.event._id} is not a valid ObjectId`)};
  if (reqBody.event.hasOwnProperty("event_time") && !isDate(reqBody.event.event_time))     {raiseError(`Invalid request body. event.event_time ${reqBody.event.event_time} is not a valid date. Iso string expected`)};
  if (!reqBody.event.hasOwnProperty("type"))                                               {raiseError(`Invalid request body. Missing event.type key`)};
  if (!reqBody.event.hasOwnProperty("station"))                                            {raiseError(`Invalid request body. Missing event.station key`)};
  if (!reqBody.event.hasOwnProperty("event_data"))                                         {raiseError(`Invalid request body. Missing event.event_data key`)};

  const {_id, event_time, version, ...data} = reqBody;
  return {
    _id: Boolean(_id) ? Mongo.ObjectId(_id) : Mongo.ObjectId(),
    event_time: Boolean(event_time) ? new Date(event_time) : new Date(),
    version: version ?? 1,
    ...data
  }
};

export default function post(req, res, next) {
  try {
    let event = checkBodyAndBuildEvent(req.body);
    res.status(201).json({ok: true, insertedEvent: event});
  }
  catch(err) {
    next(err);
  };
};