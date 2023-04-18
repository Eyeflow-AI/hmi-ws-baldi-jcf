import Mongo from "../../../components/mongo";

async function getRunning(req, res, next) {

  try {
    let stationId = req.params.stationId;
    let projection = {
      _id: true,
      id: true,
      label: true,
      start_time: true,
      end_time: true,
      station: true,
      status: true,
    };
    if (!Mongo.ObjectId.isValid(stationId)) {
      let err = new Error(`${stationId} is not a valid station id`);
      err.status = 400;
      throw err;
    };
    let result = await Mongo.db.collection("batch").findOne({ station: Mongo.ObjectId(stationId), status: "running" }, { projection });
    if (result) {
      let lastEvent = await Mongo.db.collection("events").findOne({ "event_data.batch_id": batchId }, { sort: { event_time: -1 } });
      if (lastEvent) {
        result.last_event_time = lastEvent.event_time;
      };
      result.thumbURL = "/assets/PerfumeIcon.svg";                 //TODO: Get from config file,
      result.thumbStyle = { height: 70 };                            //TODO: Get from config file,
    };
    res.status(200).json({ ok: true, batch: result ?? null });
  }
  catch (err) {
    next(err);
  };
};

export default getRunning;