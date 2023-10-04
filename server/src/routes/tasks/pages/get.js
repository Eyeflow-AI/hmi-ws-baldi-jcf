import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';


async function get(req, res, next) {
  try {
    // let edgeId = req.params.edgeId;
    let status = req.query.status ?? "created";
    let query = req.query.query ?? "";
    // console.log({query})
    query = EJSON.parse(query);
    let mongoFind = { active: true };
    if (!["all", ""].includes(status)) mongoFind.status = status;
    if (query) mongoFind = { ...mongoFind, ...query };
    // console.dir({ mongoFind }, {depth: null})
    let tasks = await Mongo.db.collection('tasks').find(mongoFind).toArray();
    tasks = EJSON.stringify(tasks);
    tasks = JSON.parse(tasks);
    res.status(200).json({ ok: true, tasks });
  }
  catch (err) {
    next(err);
  }
}

export default get;
