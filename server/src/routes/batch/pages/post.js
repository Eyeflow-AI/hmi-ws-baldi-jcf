import axios from "axios";

import Mongo from "../../../components/mongo";
import getPartData from "../../../utils/getPartData";
import errors from "../../../utils/errors"
import parseIntThrowError from "../../../utils/parseIntThrowError";


// req.body example
// {
//   "part_id": "CA-165-037:OU43",
//   "description": "CAPA ATUADOR 37 - OURO CLARO M1 3/5 ACETINADO FS",
//   "production_order": "123",
//   "total_packs": 1,
//   "parts_per_pack": 7500
// }

function getUpdateRequestBody(body) {

  let { part_id, description, production_order, total_packs, parts_per_pack, ...data } = body;
  if (!part_id) {
    let err = new Error(`Non empty part_id is required`);
    err.status = 400;
    throw err;
  }
  if (!description) {
    let err = new Error(`Non empty description is required`);
    err.status = 400;
    throw err;
  }
  if (!production_order) {
    let err = new Error(`Non empty production_order is required`);
    err.status = 400;
    throw err;
  }
  if (!total_packs) {
    let err = new Error(`Non empty total_packs is required`);
    err.status = 400;
    throw err;
  }
  if (!parts_per_pack) {
    let err = new Error(`Non empty parts_per_pack is required`);
    err.status = 400;
    throw err;
  }

  total_packs = parseInt(total_packs);
  if (isNaN(total_packs)) {
    let err = new Error(`total_packs must be a number`);
    err.status = 400;
    throw err;
  }

  parts_per_pack = parseInt(parts_per_pack);
  if (isNaN(parts_per_pack)) {
    let err = new Error(`parts_per_pack must be a number`);
    err.status = 400;
    throw err;
  }

  return {
    part_id,
    description,
    production_order,
    total_packs,
    parts_per_pack,
    ...data
  }
};

// Axios Post Body example
// {
//     "batch": {
//         "status": "new_batch",
//         "_id": "object_id",
//         "total_packs": 5,
//         "parts_per_pack": 100,
//         "profile_parms": {
//             "name": "Jet Black",
//             "exposure_time": "17000",
//             "gain": "20",
//             "gamma": "1.2",
//             "balance_ratio_red": "1000",
//             "balance_ratio_blue": "4000",
//             "balance_ratio_green": "3500"
//         }
//     }
// }

async function post(req, res, next) {

  try {
    let stationId = Mongo.ObjectId(req.params.stationId);
    let body = getUpdateRequestBody(req.body);

    let stationDocument = await Mongo.db.collection("station").findOne({ _id: stationId });
    if (!stationDocument) {
      let err = new Error(`Station with _id ${stationId} not found`);
      err.status = 400;
      throw err;
    };

    let postBatchURL = stationDocument?.parms?.postBatchURL;
    if (!postBatchURL) {
      let err = new Error(`Station with _id ${stationId} does not have parms.postBatchURL`);
      err.status = 400;
      throw err;
    };

    let runningBatch = await Mongo.db.collection("batch").findOne({ station: stationId, status: "running" });
    if (runningBatch) {
      let err = new Error(`Batch with _id ${runningBatch._id} is already running in station ${stationId}`);
      err.status = 400;
      throw err;
    }

    let partData = await getPartData(body.part_id);

    let newBatchDocument = {
      _id: Mongo.ObjectId(),
      station: stationId,
      start_time: new Date(),
      status: "running",
      info: {
        ...body
      },
    };

    let postRequestBody = {
      batch: {
        _id: newBatchDocument._id,
        status: "new_batch",
        total_packs: parseIntThrowError(body.total_packs, `Failed to parse body.total_packs ${body.total_packs} as integer`),
        parts_per_pack: parseIntThrowError(body.parts_per_pack, `Failed to parse body.parts_per_pack ${body.parts_per_pack} as integer`),
        profile_parms: partData.color_profile
      },
    };

    let response = await axios.post(postBatchURL, postRequestBody, { timeout: 1000 });
    if (response.status !== 201) {
      let err = new Error(`Failed to create batch. Edge station responded with status ${response.status}`);
      err.status = 400;
      throw err;
    };

    newBatchDocument["debug"] = {
      data_sent_to_edge_station: [postRequestBody]
    };

    let result = await Mongo.db.collection("batch").insertOne(newBatchDocument);
    if (result.insertedId) {
      res.status(201).json({ ok: true, batchId: result.insertedId });
    }
    else {
      let err = new Error(`Failed to create batch`);
      throw err;
    };
  }
  catch (err) {
    if (err?.code === "ECONNREFUSED") {
      let address = err.address;
      let port = err.port;
      err = new Error(`Edge station is not reachable`);
      err.code = errors.EDGE_STATION_IS_NOT_REACHABLE;
      err.status = 500;
      if (address && port) {
        err.extraData = { address, port };
      }
    }
    next(err);
  };
};

export default post;