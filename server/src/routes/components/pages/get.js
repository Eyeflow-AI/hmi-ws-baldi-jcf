import Mongo from "../../../components/mongo";

async function get(req, res, next) {
  try {
    let name = req.params.scriptName;
    let station = req.params.stationId;
    let query = JSON.parse(req?.query?.data ?? "{}");
    console.log({ query });
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
        result = await result;
        if (Array.isArray(result)) {
          for (let i = 0; i < result.length; i++) {
            if (result[i].tag) {
              let tagName = result[i].tag;
              let tagDocument = await MONGO.db
                .collection("components")
                .findOne({ name: tagName });
              let tagScript = tagDocument ? tagDocument.document : "";
              if (tagScript) {
                let tagOutput = result[i].output;
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
    res.status(200).json({ ok: Boolean(document), result });
  } catch (err) {
    next(err);
  }
}

export default get;
