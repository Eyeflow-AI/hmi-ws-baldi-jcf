import Mongo from "../../../components/mongo";

async function get(req, res, next) {

  try {
    let batchId = req.params.batchId;
    let result = await Mongo.db.collection("batch").findOne({ _id: new Mongo.ObjectId(batchId) });
    if (result) {
      res.status(200).json({ ok: true, batch: result });
    }
    else {
      let err = new Error(`Batch with _id ${batchId} does not exist`);
      err.status = 400;
      throw err;
    }
  }
  catch (err) {
    next(err);
  };
};

export default get;