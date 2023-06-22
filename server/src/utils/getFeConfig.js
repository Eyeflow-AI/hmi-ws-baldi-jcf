import Mongo from "../components/mongo"


let feConfigData = null;
async function getFeConfig() {

  if (!feConfigData || (new Date() - feConfigData.time) > 1000 * 15) {
    // Get new feConfig if data is older than 15 seconds
    let document = await Mongo.db.collection('params').findOne({'name': 'feConfig'});
    if (document) {
      feConfigData = {
        time: new Date(),
        document,
      };
    }
    else {
      let err = new Error(`Could not find feConfig document`);
      throw err;
    }
  }

  return feConfigData.document;
};

export default getFeConfig;