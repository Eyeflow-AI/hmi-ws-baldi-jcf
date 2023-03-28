import Mongo from "../../../components/mongo";

async function get(req, res, next) {

  try {
    // let stationId = req.params.stationId;
    let batchId = req.params.batchId;
    let result = await Mongo.db.collection("batch").findOne({_id: Mongo.ObjectId(batchId)});
    if (result) {
      //TODO get count data
      let countData = {
        status: [
          {label: "OK", value: Math.floor(Math.random() * 500)},
          {label: "NOK", value: Math.floor(Math.random() * 500)},
        ],
        topAnomalies: [
          {label: "FOO", value: Math.floor(Math.random() * 500)},
          {label: "BAR", value: Math.floor(Math.random() * 500)},
        ]
      };
      countData.topAnomalies.sort((a,b) => b.value - a.value);
      res.status(200).json({ok: true, batch: result, countData});
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