import Mongo from "../../../components/mongo";


function updateConfig(data, {hosts}) {

  try {
    if (Array.isArray(data)) {
      for (let i = 0; i< data.length; i++) {
        if (data[i] !== null && typeof data[i] === 'object')  {
          data[i] = updateConfig(data[i], {hosts});
        }
      };
    }
    else {
      for (let [key, value] of Object.entries(data)) {
        if (value !== null && typeof value === 'object') {
          updateConfig(value, {hosts});
        }
        else if (typeof(value)=== 'string'){
          if (value.includes("{{hosts")) {
            let regexp = /({{hosts.*}}).*/g;
            let replaceStr = regexp.exec(value)?.[1];
            if (replaceStr) {
              let regexp = /.*hosts\.(.*)}}/g;
              let host = regexp.exec(replaceStr)?.[1];
              if (host && hosts.hasOwnProperty(host)) {
                data[key] = value.replace(replaceStr, hosts[host].url);
              }
            }
          }
        }
      };
    };
    return data;
  }
  catch (err) {
    err.message = `Error in updateConfig function: ${err.message}`;
    throw err;
  };
};

async function getConfigForFE(req, res, next) {

  const requiredConfig = ["feConfig", "locale"];
  try {
    let output = {};
    let documents = await Mongo.db.collection('params').find({'name': {"$in": requiredConfig}}).toArray();
    let maxDatetime = new Date(1900, 0, 1);
    for (let document of documents) {
      output[document.name] = document;
      if (document.name === "feConfig") {
        updateConfig(document["pages"], {hosts: document["hosts"]});
      }
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