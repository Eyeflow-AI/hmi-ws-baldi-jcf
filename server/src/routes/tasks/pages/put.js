import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';


async function put(req, res, next) {
  try {
    let taskId = req.params.taskId;
    let status = req.body.status;
    if (!status) {
      let err = new Error(`Body key status cannot be empty`);
      err.status = 400;
      throw err;
    };

    let taskResult = req.body.task_result;

    let update = { status };
    if (taskResult) {
        taskResult = JSON.stringify(taskResult);
        taskResult = EJSON.parse(taskResult);
        update.task_result = taskResult;
    }

    let result = await Mongo.db.collection('tasks').updateOne(
      { _id: new Mongo.ObjectId(taskId) },
      { $set: update }
    );
    if (result.acknowledged && result.modifiedCount === 1) {
      res.status(200).json({ ok: true });
    }
    else {
      let err = new Error(`Could not update task with id ${taskId}`);
      throw err;
    }
  }
  catch (err) {
    next(err);
  }
};

export default put;