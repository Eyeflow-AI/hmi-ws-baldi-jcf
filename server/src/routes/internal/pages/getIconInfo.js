// /**
// * 
// */

import Mongo from "../../../components/mongo";
async function getIconInfo(req, res, next) {
  try {
    let icon = req?.params?.icon ?? '';
    if (icon) {
      let iconInfo = await Mongo.db.collection('icons').findOne({ icon });
      res.status(200).json(iconInfo);
    }
    else {
      res.status(204).json('No icon informed');

    }
  }
  catch (err) {
    console.log({ err })
    res.status(204).json({ msg: 'file not found' })
  }
};

export default getIconInfo;