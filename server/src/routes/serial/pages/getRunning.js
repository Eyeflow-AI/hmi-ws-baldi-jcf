import Mongo from "../../../components/mongo";
import FeConfigSingleton from "../../../components/FeConfigSingleton";

async function getRunning(req, res, next) {
  try {
    let stationId = new Mongo.ObjectId(req.params.stationId);

    let host = await FeConfigSingleton.getHost("hmi-files-ws");
    let instance = await FeConfigSingleton.getInstance();

    if (!Mongo.ObjectId.isValid(stationId)) {
      let err = new Error(`${stationId} is not a valid station id`);
      err.status = 400;
      throw err;
    }
    let result = await Mongo.db
      .collection("staging_events")
      .find({ station: stationId })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    result = result[0];

    if (result) {
      result = {
        _id: result.event_data.inspection_id,
        document_id: result._id,
        inspection_id: result.event_data.inspection_id,
        part_id: result.event_data.part_data.id,
        event_time: result.event_data.window_ini_time,
        count: 1,
        label:
          result.event_data?.part_data?.id?.slice(
            -instance?.wsInfo?.label_size ?? -5
          ) ?? "N/A",
        status: result.event_data.inspection_result.ok ? "ok" : "ng",
        result: result.event_data.inspection_result.ok,
        collection: "staging_events",
      };
      result.thumbURL = `${host.url}/others/GearIcon.svg`; //TODO: Get from config file,
      result.thumbStyle = { height: 70 }; //TODO: Get from config file,
    }

    res.status(200).json({ ok: true, serial: result ?? null });
  } catch (err) {
    next(err);
  }
}

export default getRunning;
