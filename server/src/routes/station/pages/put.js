import Mongo from "../../../components/mongo";
import slugify from "../../../utils/slugify";

async function put(req, res, next) {

  try {
    let collection = "station";
    let stationId = req.params.stationId;
    let stationData = req.body;
    let stationWithThisName = await Mongo.db.collection(collection).findOne({ label: stationData.label, _id: { $ne: new Mongo.ObjectId(stationId) } });
    if (Boolean(stationWithThisName)) {
      let err = new Error(`Station with label ${stationData.label} already exists.`);
      err.status = 400;
      throw err;
    }
    else {
      let slugLabel = slugify(stationData.label);
      let update = {
        $set: {
          label: stationData.label,
          parms: JSON.parse(stationData.parms),
          slugLabel,
        }
      };
      let filter = { _id: new Mongo.ObjectId(stationId) };
      let options = { returnOriginal: false };
      await Mongo.db.collection(collection).findOneAndUpdate(filter, update, options);
      res.status(200).json({ message: `Station ${stationId} updated.` });
    }
  }
  catch (err) {
    next(err);
  };
};

export default put;