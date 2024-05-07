import Mongo from "../../../components/mongo";

async function putQueryPipelinesName(req, res, next) {
  try {
    let oldName = req.params.name;
    let newName = req.body.name;
    if (!oldName) {
      res.status(400).json({ ok: false, message: "Old name is required" });
      return;
    }
    if (!newName) {
      res.status(400).json({ ok: false, message: "New name is required" });
      return;
    }
    await Mongo.db
      .collection("queries_pipelines")
      .updateOne({ name: oldName }, { $set: { name: newName } });
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export default putQueryPipelinesName;
