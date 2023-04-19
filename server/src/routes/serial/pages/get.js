import Mongo from "../../../components/mongo";

async function get(req, res, next) {

  try {
    let serialId = req.params.serialId;
    let result = await Mongo.db.collection("batch").findOne({ _id: Mongo.ObjectId(serialId) });
    if (result) {
      res.status(200).json({ ok: true, batch: result });
    }
    else {
      let err = new Error(`Serial with _id ${serialId} does not exist`);
      err.status = 400;
      throw err;
    }
  }
  catch (err) {
    next(err);
  };
};

export default get;