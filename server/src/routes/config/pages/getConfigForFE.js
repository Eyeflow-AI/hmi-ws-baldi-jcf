import Mongo from "../../../components/mongo";

async function getConfigForFE(req, res, next) {

  const requiredConfig = ["feConfig", "locale"];
  try {
    let output = {};
    let documents = await Mongo.db.collection('params').find({'name': {"$in": requiredConfig}}).toArray();
    let maxDatetime = new Date(1900, 0, 1);
    for (let document of documents) {
      output[document.name] = document;
      maxDatetime = Math.max(maxDatetime, document.datetime);
    };
    output.datetime = new Date(maxDatetime);
    res.status(200).json(output);
  }
  catch (err) {
    next(err);
  };
};

export default getConfigForFE;