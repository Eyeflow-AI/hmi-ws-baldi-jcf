// /**
// * 
// */

import Mongo from "../../../components/mongo";


async function putActiveDataset(req, res, next) {
  try {
    let datasetId = req?.body?.datasetId ?? '';
    let status = req?.body?.status ?? false;
    if (datasetId) {
      let fromToDocument = await Mongo.db.collection('params').findOneAndUpdate({
        name: 'fromTo'
      }, {
        [status ? '$addToSet' : '$pull']: {
          activeDatasets: datasetId
        }
      }, { upsert: true, returnDocument: 'after' });
      fromToDocument = fromToDocument?.value ?? {};
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