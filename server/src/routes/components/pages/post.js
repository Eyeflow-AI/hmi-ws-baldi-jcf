import Mongo from "../../../components/mongo";

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
        eval(script);
        console.log({ result, script });
        result = await result;
        console.log({ a: result });
        // if (Array.isArray(result)) {
        //   for (let i = 0; i < result.length; i++) {
        //     console.log({ x: result[i] });
        //     if (result[i].tag) {
        //       let tagName = result[i].tag;
        //       let tagDocument = await MONGO.db
        //         .collection("components")
        //         .findOne({ name: tagName });
        //       let tagScript = tagDocument ? tagDocument.document : "";
        //       console.log({ tagScript });
        //       if (tagScript) {
        //         let tagOutput = result[i].output;
        //         console.log({ tagOutput });
        //         tagScript = tagScript.replace(/{{variable}}/g, "tagOutput");
        //         eval(tagScript);
        //         result[i].output = await tagOutput;
        //       }
        //     } else {
        //       // result[i] = result[i].output;
        //     }
        //   }
        // } else if (result?.tag) {
        //   let tagName = result.tag;
        //   let tagDocument = await MONGO.db
        //     .collection("components")
        //     .findOne({ name: tagName });
        //   let tagScript = tagDocument ? tagDocument.document : "";
        //   if (tagScript) {
        //     console.log({ op: result.output });
        //     result = result.output;
        //     eval(tagScript);
        //     result = await result;
        //   }
        // } else {
        //   result = result.output;
        // }
      } catch (err) {
        result = err.message;
      }
    }
    console.dir({ result }, { depth: null });
    res.status(200).json({ ok: Boolean(document), result, data });
  } catch (err) {
    next(err);
  }
}

export default post;
