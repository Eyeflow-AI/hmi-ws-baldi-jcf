import Mongo from "../../../components/mongo";

async function get(req, res, next) {
  try {
    let name = req.params.scriptName;
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
