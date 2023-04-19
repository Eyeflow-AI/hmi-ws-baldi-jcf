import Mongo from "../../../components/mongo";

async function post(req, res, next) {

  try {
    let stationId = Mongo.ObjectId(req.params.stationId);

    let runningBatch = await Mongo.db.collection("batch").findOne({station: stationId, status: "running"});
    if (runningBatch) {
      let err = new Error(`Batch with _id ${runningBatch._id} is already running`);
      err.status = 400;
      throw err;
    }

    let newBatchDocument = {
        station: stationId,
        start_time: new Date(),
        status: "running",
        info: {
            ...req.body
        }
    };

    let result = await Mongo.db.collection("batch").insertOne(newBatchDocument);
    if (result.insertedId) {
      res.status(201).json({ok: true, batchId: result.insertedId});
    }
    else {
      let err = new Error(`Failed to create batch`);
      throw err;
    };
  }
  catch (err) {
    next(err);
  };
};

export default post;