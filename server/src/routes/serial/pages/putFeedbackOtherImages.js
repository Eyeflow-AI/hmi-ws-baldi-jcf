import Mongo from "../../../components/mongo";

async function putFeedbackOtherImages(req, res, next) {

  try {
    let stationId = req.params.stationId;
    let serialId = req.params.serialId;
    let regionName = req.body.regionName;
    const tokenData = { ...req?.app?.auth } ?? {};
    let imageId = req.body.imageId;

    let query = {
      station: new Mongo.ObjectId(stationId),
      'event_data.inspection_id': serialId,
      'event_data.inspection_result.check_list.region.name': regionName,
    };
    let result = await Mongo.db.collection("inspection_events").updateOne(query,
      {
        $set: {
          'event_data.inspection_result.check_list.region.$.feedback': true,
        },
      }

    );

    await Mongo.db.collection('inspection_events').updateOne({ 'event_data.inspection_id': serialId, station: new Mongo.ObjectId(stationId) }, { $set: { feedback_time: new Date() } });
    let document = await Mongo.db.collection('image_detections').findOne({_id: new Mongo.ObjectId(imageId)});
    await Mongo.db.collection("events_to_upload").insertOne({
      data: document?.info?.[0],
      original_id: document._id,
      original_collection: 'image_detections',
      uploaded: false,
      host: document.host,
      feedback_user: tokenData.tokenPayload.payload.username,
    });

    res.status(200).json({ ok: true});
  }
  catch (err) {
    next(err);
  };
};

export default putFeedbackOtherImages;