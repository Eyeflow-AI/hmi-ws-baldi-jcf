import Mongo from "../../../components/mongo";

async function getData(req, res, next) {

  try {
    let batchId = Mongo.ObjectId(req.params.batchId);

    let result = await Mongo.db.collection("batch").findOne({ _id: batchId });
    if (!result) {
      let err = new Error(`Batch with _id ${batchId} does not exist`);
      err.status = 400;
      throw err;
    };

    if (!result.batch_data) {
      result.batch_data = {};
    };

    result.batch_data.parts_ok = result.batch_data?.total_output_parts ?? 0;
    result.batch_data.parts_ng = 0;
    result.batch_data.conveyor_speed = 0;
    result.batch_data.ng = result.batch_data.ng ?? {};
    result.batch_data.defects_count = {};

    if (result.status === "running") {
      let lastEvent = await Mongo.db.collection("events").findOne({ "event_data.batch_id": batchId }, { sort: { event_time: -1 } });
      if (lastEvent && lastEvent.event_data) {
        let {total_output_parts, ...event_data} = lastEvent.event_data;
        Object.assign(result.batch_data, event_data);
        result.batch_data.conveyor_speed = lastEvent.conveyor_speed;
        result.batch_data.parts_ok = total_output_parts ?? 0;
      }
    }

    for (let [key, valueList] of Object.entries(result.batch_data.ng)) {
      for (let value of valueList) {
        result.batch_data.parts_ng += value?.count ?? 0;
        if (result.batch_data.defects_count.hasOwnProperty(value.label)) {
          result.batch_data.defects_count[value.label] += value?.count ?? 0;
        }
        else {
          result.batch_data.defects_count[value.label] = value?.count ?? 0;
        };
      };
    };

    res.status(200).json({ ok: true, batch: result });
  }
  catch (err) {
    next(err);
  };
};

export default getData;