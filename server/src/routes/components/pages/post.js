import Mongo from "../../../components/mongo";
import axios from "axios";

async function post(req, res, next) {
  try {
    let name = req.params.scriptName;
    let params = req.params;
    let station = req.params.stationId;
    let data = req?.body?.data;
    if (!name) {
      res
        .status(400)
        .json({ ok: false, message: "Component name is required" });
      return;
    }
    let document = await Mongo.db.collection("scripts").findOne({ name });
    let script = document ? document.document : "";

    let result = null;
    if (script) {
      try {
        const MONGO = Mongo;
        const AXIOS = axios;
        const PARAMS = params;
        const DATA = data;
        const STATION = station;
        eval(script);
        result = await result;
      } catch (err) {
        result = err.message;
      }
    }

    if (typeof result === "string") {
      res.status(400).json({
        ok: false,
        message: result,
        data: {
          notification: {
            type: "error",
            message: result,
          },
        },
      });
    } else {
      res.status(201).json(result);
    }
  } catch (err) {
    next(err);
  }
}

export default post;
