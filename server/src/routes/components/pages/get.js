import Mongo from "../../../components/mongo";
import axios from "axios";

async function get(req, res, next) {
  try {
    let name = req.params.scriptName;
    let station = req.params.stationId;
    // console.log({ station, name });
    let query = JSON.parse(req?.query?.data ?? "{}");
    console.log({ query, name });
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
        console.log({ result, script });
        result = await result;
        if (name == "runningItem-baldi") {
          console.log({ a: result });
        }
        if (Array.isArray(result)) {
          for (let i = 0; i < result.length; i++) {
            console.log({ x: result[i] });
            if (result[i].tag) {
              let tagName = result[i].tag;
              let tagDocument = await MONGO.db
                .collection("components")
                .findOne({ name: tagName });
              let tagScript = tagDocument ? tagDocument.document : "";
              console.log({ tagScript });
              if (tagScript) {
                let tagOutput = result[i].output;
                console.log({ tagOutput });
                tagScript = tagScript.replace(/{{variable}}/g, "tagOutput");
                eval(tagScript);
                result[i].output = await tagOutput;
              }
            } else {
              // result[i] = result[i].output;
            }
          }
        } else if (result?.tag) {
          let tagName = result.tag;
          let tagDocument = await MONGO.db
            .collection("components")
            .findOne({ name: tagName });
          let tagScript = tagDocument ? tagDocument.document : "";
          if (tagScript) {
            console.log({ op: result.output });
            result = result.output;
            eval(tagScript);
            result = await result;
          }
        } else {
          result = result.output;
        }
      } catch (err) {
        result = err.message;
      }
    }
    // res.status(200).json({ ok: Boolean(document), result });

    // if (name == "runningItem-baldi") {
    //   // console.log({ a: script });
    console.dir({ result }, { depth: null });
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
