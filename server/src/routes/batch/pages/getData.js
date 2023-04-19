import Mongo from "../../../components/mongo";

async function getData(req, res, next) {

  try {
    let batchId = Mongo.ObjectId(req.params.batchId);

    let result = await Mongo.db.collection("batch").findOne({ _id: batchId });
    if (result) {
      if (result.status === "running") {
        let lastEvent = await Mongo.db.collection("events").findOne({ "event_data.batch_id": batchId }, { sort: { event_time: -1 } });
        if (lastEvent) {
          let partsOk = 0;
          let partsNg = 0;
          let conveyourSpeed = lastEvent.conveyor_speed ?? lastEvent.event_data.conveyor_speed ?? 0;
          let defectsCount = {};

          result.batch_data = lastEvent.event_data;

          for (let [key, valueList] of Object.entries(lastEvent.event_data.ok)) {
            for (let value of valueList) {
              partsOk += value?.count ?? 0;
            };
          };

          for (let [key, valueList] of Object.entries(lastEvent.event_data.ng)) {
            for (let value of valueList) {
              partsNg += value?.count ?? 0;
              if (defectsCount.hasOwnProperty(value.label)) {
                defectsCount[value.label] += value?.count ?? 0;
              }
              else {
                defectsCount[value.label] = value?.count ?? 0;
              };
            };
          };
          result.batch_data.conveyor_speed = conveyourSpeed;
          result.batch_data.parts_ng = partsNg;
          result.batch_data.parts_ok = partsOk;
          result.batch_data.defects_count = defectsCount;
        }
      }
      else {
        // TODO
      };

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

export default getData;