import Mongo from "../../../components/mongo";
import axios from "axios";
async function getMaskMapList(req, res, next) {

  try {
    let feConfigDoc = await Mongo.db.collection("params").findOne({ name: 'feConfig' });
    let maskMapId = feConfigDoc.pages["HMI"].options.maskMapId

    let maskMapListURL = `${feConfigDoc.pages["HMI"].options.maskMapListURL}/${maskMapId}/examples.json`
    let maskMapInfoURL = `${feConfigDoc.pages["HMI"].options.maskMapListURL}/${maskMapId}/parms.json`

    const maskList = await axios.get(maskMapListURL);
    const maskMapInfo = await axios.get(maskMapInfoURL);

    res.status(200).json({ ok: true, data: { maskList: maskList.data, maskMapInfo: maskMapInfo.data }});
  }
  catch (err) {
    next(err);
  };
};

export default getMaskMapList;
