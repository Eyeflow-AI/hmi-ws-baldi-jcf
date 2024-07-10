import Mongo from "../../../components/mongo";
import axios from "axios";

async function get(req, res, next) {
  try {
    let name = req.params.scriptName;
    let station = req.params.stationId;
    // console.log({ station, name });
    let query = JSON.parse(req?.query?.data ?? "{}");
    // console.log({ query, name });
    if (!name) {
      res.status(400).json({
        ok: false,
        message: "Component name is required",
        data: {
          notification: {
            type: "error",
            message: "Component name is required",
          },
        },
      });
      return;
    }
    let document = await Mongo.db.collection("scripts").findOne({ name });
    let script = document ? document.document : "";
    // if (name == "runningItem-baldi") {
    // }
    let result = null;
    if (script) {
      try {
        const MONGO = Mongo;
        const AXIOS = axios;
        const QUERY = query;
        const STATION = station;
        eval(script);
        try {
          result = await result;
          console.log({ result });
        } catch (err) {
          console.log({ result, err });

          result = err.message;
        } finally {
        }
      } catch (err) {
        result = err.message;
      }
    }
    // res.status(200).json({ ok: Boolean(document), result });

    // if (name == "itemInfo") {
    //   // console.log({ a: script });
    // console.dir({ result }, { depth: null });
    // }

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
      res.status(200).json({ ok: Boolean(document), result });
    }
  } catch (err) {
    next(err);
  }
}

export default get;
