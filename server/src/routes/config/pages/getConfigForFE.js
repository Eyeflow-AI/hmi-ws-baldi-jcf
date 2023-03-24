import Mongo from "../../../components/mongo";

async function getConfigForFE(req, res, next) {

  const requiredConfig = ["feConfig", "locale"];
  try {
    let output = {};
    let documents = await Mongo.db.collection('params').find({'name': {"$in": requiredConfig}}).toArray();
    let max_event_time = new Date(1900, 0, 1);
    for (let document of documents) {
      output[document.name] = document;
      max_event_time = Math.max(max_event_time, document.event_time);
    };
    output.event_time = new Date(max_event_time);
    res.status(200).json(output);
  }
  catch (err) {
    next(err);
  };
};

export default getConfigForFE;