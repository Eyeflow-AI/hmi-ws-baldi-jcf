import Mongo from "../../../components/mongo";
import axios from "axios";
async function getMaskMapList(req, res, next) {

  try {
    let feConfigDoc = await Mongo.db.collection("params").findOne({ name: 'feConfig' });
    let maskMapId = feConfigDoc.pages["HMI"].options.mask_map_id

    let maskMapListURL = `${feConfigDoc.pages["HMI"].options.maskMapListURL}/${maskMapId}/examples.json`

    const response = await axios.get(maskMapListURL);

    res.status(200).json({ ok: true, data: response.data });
  }
  catch (err) {
    next(err);
  };
};

export default getMaskMapList;
