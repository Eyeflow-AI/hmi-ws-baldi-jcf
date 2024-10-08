import Mongo from "../components/mongo";

async function consolidateBatch(batchId, status = "closed") {
  if (["running", "paused", "closed"].includes(status) === false) {
    let err = new Error(`Invalid status ${status}`);
    throw err;
  }

  let batchDocument = await Mongo.db
    .collection("batch")
    .findOne({ _id: batchId });
  if (!batchDocument) {
    let err = new Error(`Batch with _id ${batchId} does not exist`);
    err.status = 400;
    throw err;
  }

  let lastEvent = await Mongo.db
    .collection("events")
    .findOne({ "event_data.batch_id": batchId }, { sort: { event_time: -1 } });
  let updateResult;
  if (lastEvent) {
    delete lastEvent.event_data.batch_id;
    let update = { $set: { status, batch_data: lastEvent.event_data } };
    if (["paused", "closed"].includes(status)) {
      update["$set"]["end_time"] = new Date();
    }
    updateResult = await Mongo.db
      .collection("batch")
      .updateOne({ _id: batchId }, update);
    //   if (updateResult.modifiedCount !== 1) {
    //     let err = new Error(`Batch with _id ${batchId} was not updated`);
    //     err.status = 500;
    //     throw err;
    //   }
    //   let deleteResult = await Mongo.db.collection("events").deleteMany({ "event_data.batch_id": batchId, event_time: { $lte: lastEvent.event_time } });
  } else {
    let update = { $set: { status } };
    if (["paused", "closed"].includes(status)) {
      update["$set"]["end_time"] = new Date();
    }
    updateResult = await Mongo.db
      .collection("batch")
      .updateOne({ _id: batchId }, update);
  }

  if (updateResult.modifiedCount !== 1) {
    let err = new Error(`Batch with _id ${batchId} was not updated`);
    err.status = 500;
    throw err;
  }

  return true;
}

export default consolidateBatch;
