import Mongo from "../../../components/mongo";

async function get(req, res, next) {
  try {
    let edgeId = req.params.edgeId;
    let status = req.query.status ?? "created";
    let mongoFind = { edge_id: new Mongo.ObjectId(edgeId), active: true };
    if (!["all", ""].includes(status)) mongoFind.status = status;

    let tasks = await Mongo.db.collection('tasks').find(mongoFind).toArray();
    res.status(200).json({ ok: true, tasks });
  }
  catch (err) {
    next(err);
  }
}

export default get;
