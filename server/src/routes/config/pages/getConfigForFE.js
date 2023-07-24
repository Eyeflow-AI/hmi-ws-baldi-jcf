import Mongo from "../../../components/mongo";
import FeConfigSingleton from "../../../components/FeConfigSingleton";

export async function getConfig(){
  const requiredConfig = ["locale"];
  let feConfig = await FeConfigSingleton.getInstance();
  let output = {
    [feConfig.name]: feConfig,
  };
  let documents = await Mongo.db.collection('params').find({'name': {"$in": requiredConfig}}).toArray();
  let maxDatetime = feConfig.datetime;
  for (let document of documents) {
    output[document.name] = document;
    maxDatetime = Math.max(maxDatetime, document.datetime);
  };
  output.datetime = new Date(maxDatetime);
  return output;
}

async function getConfigForFE(req, res, next) {

  const requiredConfig = ["locale"];
  try {
    let output = await getConfig();
    res.status(200).json(output);
  }
  catch (err) {
    next(err);
  };
};

export default getConfigForFE;