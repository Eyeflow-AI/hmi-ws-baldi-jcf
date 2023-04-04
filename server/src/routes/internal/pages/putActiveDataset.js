// /**
// * 
// */

import Mongo from "../../../components/mongo";


async function putActiveDataset(req, res, next) {
  try {
    let datasetId = req?.body?.datasetId ?? '';
    let status = req?.body?.status ?? false;
    if (datasetId) {
      if (status) {
        await Mongo.db.collection('params').updateOne({
          name: 'fromTo'
        },
          { $addToSet: { activeDatasets: datasetId } }, { upsert: true });
      }
      else {
        await Mongo.db.collection('params').updateOne({
          name: 'fromTo'
        },
          { $pull: { activeDatasets: datasetId } }, { upsert: true });
      }
      let fromToDocument = await Mongo.db.collection('params').findOne({ name: 'fromTo' });
      res.status(200).json(fromToDocument);
    }
    else {
      res.status(204).json('No datasetId informed');

    }
  }
  catch (err) {
    // console.log({ err })
    res.status(204).json({ err })
  }
};

export default putActiveDataset;