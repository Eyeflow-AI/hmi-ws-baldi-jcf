import Mongo from "../../../components/mongo";

async function postEventToUpload(req, res, next) {

  try {
    let jsonData = req.body.jsonData;
    let jsonFileData = req.body.jsonFileData;
    let folderInfo = req.body.folderInfo;

    const tokenData = { ...req?.app?.auth } ?? {};

    await Mongo.db.collection("events_to_upload").insertOne({
      data: jsonData,
      file_data: jsonFileData,
      folder_info: folderInfo,
      original_collection: 'images-analyser',
      uploaded: false,
      feedback_user: tokenData?.tokenPayload?.payload?.username ?? '',
    });

    res.status(200).json({ ok: true });
  }
  catch (err) {
    next(err);
  };
};

export default postEventToUpload;