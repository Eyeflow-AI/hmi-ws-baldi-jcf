import Mongo from "../../../components/mongo";


async function _delete(req, res, next) {
  try {
    let taskId = req.params.taskId;
    let result = await Mongo.db.collection('tasks').updateOne(
      { _id: new Mongo.ObjectId(taskId) },
      { $set: { active: false, deleted_date: new Date() } }
    );
    if (result.acknowledged && result.modifiedCount === 1) {
      res.status(200).json({ ok: true });
    }
    else {
      let err = new Error(`Could not delete task with id ${taskId}`);
      throw err;
    }
  }
  catch (err) {
    next(err);
  }
};

export default _delete;