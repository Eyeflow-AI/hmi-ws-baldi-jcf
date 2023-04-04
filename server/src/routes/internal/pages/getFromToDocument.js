// /**
// * 
// */

import Mongo from "../../../components/mongo";
async function getFromToDocument(req, res, next) {
  try {
    let fromToDocument = await Mongo.db.collection('params').findOne({ name: 'fromTo' });
    res.status(200).json(fromToDocument);
  }
  catch (err) {
    console.log({ err })
    res.status(204).json({ msg: 'document not found' })
  }
};

export default getFromToDocument;