import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';

// Task document example:
// {
//   "_id": {
//     "$oid": "65045df75fc6acdc6cf1f2ff"
//   },
//   "edge_id": {
//     "$oid": "634d934d73f0ca001348b784"
//   },
//   "status": "completed",
  // "task": {
  //   "type": "run_command",
  //   "params": {
  //     "command": "ls -la"
  //   }
  // },
//   "task_result": {
//     "execute_date": {
//       "$date": "2023-09-16T15:32:18Z"
//     },
//     "status": "success",
//     "log_data": {
//       "stdout": "total 530620\ndrwxr-xr-x  3 eyeflow eyeflow      4096 set 13 15:01 .\ndrwxrwsr-x 10 eyeflow eyeflow      4096 set  7 15:30 ..\n-rw-r--r--  1 eyeflow eyeflow      1969 set 13 14:52 compose-bak.yaml\n-rw-r--r--  1 eyeflow users        1969 set 13 14:20 compose.yaml\n-rw-rw-r--  1 eyeflow eyeflow       775 set  6 18:28 edge-key.pub\n-rw-rw-r--  1 eyeflow eyeflow      1228 set  6 18:28 edge.license\n-rwxrwxr-x  1 eyeflow eyeflow       921 set  7 15:24 edge_run\n-rw-rw-r--  1 eyeflow eyeflow       711 set 13 13:07 eyeflow_conf.json\n-rwxrwxr-x  1 eyeflow eyeflow   1133440 set 13 13:07 eyeflow_edge\n-rwxr-xr-x  1 eyeflow eyeflow   4605256 jul 25 16:36 eyeflow_edge.monolith\n-rw-r--r--  1 root    root            0 set 13 13:07 __init__.py\n-rw-r--r--  1 root    root          109 set 13 13:07 install_service.sh\n-rw-r--r--  1 eyeflow eyeflow  49883616 ago 29 14:20 libnvinfer_plugin.so.8\n-rw-r--r--  1 eyeflow eyeflow 487580328 ago 29 14:20 libnvinfer.so.8\n-rw-rw-r--  1 eyeflow eyeflow       222 jul 25 16:19 license.json\n-rw-r--r--  1 root    root          170 set 13 13:07 manifest.json\n-rw-r--r--  1 eyeflow users       13057 set 13 14:45 prepare_models.py\ndrwxrwxr-x  2 eyeflow eyeflow      4096 set 13 13:07 __pycache__\n-rw-r--r--  1 root    root         3413 set 13 13:07 request_license\n-rw-rw-r--  1 eyeflow eyeflow      3413 abr 12 13:22 request_license.py\n-rw-r--r--  1 root    root          155 set 13 13:07 restart_edge\n-rw-r--r--  1 root    root          507 set 13 13:07 run_flow.service\n-rwxr-xr-x  1 root    root          215 set 13 13:07 run_flow.sh\n-rw-r--r--  1 root    root           23 set 13 13:07 setup.sh\n-rwxr-xr-x  1 eyeflow eyeflow      7961 set 13 13:07 update_edge\n-rw-r--r--  1 root    root          131 set 13 13:07 update_edge.service\n-rw-r--r--  1 root    root          159 set 13 13:07 update_edge.timer\n-rwxr-xr-x  1 eyeflow root         3815 set 13 14:57 upload_extracts\n-rw-r--r--  1 eyeflow eyeflow       149 set 13 15:02 upload_extracts_all.service\n-rwxrwxr-x  1 eyeflow eyeflow       207 set 13 15:17 upload_extracts_all.sh\n-rw-r--r--  1 eyeflow eyeflow       160 set 13 15:18 upload_extracts_all.timer\n-rw-rw-r--  1 eyeflow eyeflow     14231 set 13 13:07 utils.py\n",
//       "stderr": ""
//     }
//   }
// }

async function post(req, res, next) {
  try {
    // let edgeId = req?.params?.edgeId;
    let task = req.body.task;
    task = JSON.stringify(task);
    task = EJSON.parse(task);

    // if (!Mongo.ObjectId.isValid(edgeId)) {
    //   let err = new Error(`Invalid edge id: ${edgeId}`);
    //   err.status = 400;
    //   throw err;
    // }

    if (!task) {
      let err = new Error("Missing task in request body");
      err.status = 400;
      throw err;
    }

    if (!task?.type) {
      let err = new Error("Missing task.type in request body");
      err.status = 400;
      throw err;
    }

    if (!task?.params) {
      let err = new Error("Missing task.params in request body");
      err.status = 400;
      throw err;
    }

    let taskDoc = {
      // edge_id: new Mongo.ObjectId(edgeId),
      active: true,
      inserted_date: new Date(),
      status: "created",
      task,
    };

    let result = await Mongo.db.collection('tasks').insertOne(taskDoc);
    console.log({iId: result.insertedId})
    res.status(201).json({ ok: true, taskId: result.insertedId });
  }
  catch (err) {
    next(err);
  }
};

export default post;