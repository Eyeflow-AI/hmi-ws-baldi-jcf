import Mongo from "../../../components/mongo";

async function putFeedback(req, res, next) {
  try {
    let stationId = req.params.stationId;
    let serialId = req.params.serialId;
    let regionName = req.body.regionName;
    const tokenData = { ...req?.app?.auth } ?? {};
    let query = {
      station: new Mongo.ObjectId(stationId),
      "event_data.inspection_id": serialId,
      "event_data.inspection_result.check_list.region.name": regionName,
    };
    let result = await Mongo.db
      .collection("inspection_events")
      .updateOne(query, {
        $set: {
          "event_data.inspection_result.check_list.region.$.feedback": true,
        },
      });

    result = await Mongo.db.collection("inspection_events").updateOne(
      {
        "event_data.inspection_id": serialId,
        station: new Mongo.ObjectId(stationId),
      },
      { $set: { feedback_time: new Date() } }
    );
    if (result) {
      let document = await Mongo.db.collection("inspection_events").findOne({
        "event_data.inspection_id": serialId,
        station: new Mongo.ObjectId(stationId),
      });
      let feedbackRegion =
        document.event_data.inspection_result.check_list.region.find(
          (region) => region.name === regionName
        );
      let dataset_id =
        document.event_data.inspection_result.check_list.info.dataset_id;
      await Mongo.db.collection("events_to_upload").insertOne({
        data: feedbackRegion,
        original_id: document._id,
        original_collection: "inspection_events",
        uploaded: false,
        dataset_id,
        feedback_user: tokenData?.tokenPayload?.payload?.username,
      });

      res.status(200).json({ ok: true });
    } else {
      let err = new Error(`Could not update document ${serialId}`);
      console.log({ result });
      err.status = 400;
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

export default putFeedback;
