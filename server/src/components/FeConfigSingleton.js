import Mongo from "./mongo"
import log from "../utils/log";

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

const FeConfigSingleton = (() => {
  let raw;
  let instance;
  let lastUpdated;

  async function updateData() {
    let document = await Mongo.db.collection('params').findOne({'name': 'feConfig'});
    if (!document) {
      let err = new Error(`Could not find feConfig document`);
      throw err;
    }
    else if (!instance || document.datetime !== instance.datetime) {
      log.info("Updating feConfig");

      raw = JSON.parse(JSON.stringify(document));
      Object.freeze(raw);

      instance = document;
      updateConfig(instance["pages"], {hosts: instance.hosts});
      updateConfig(instance["components"], {hosts: instance.hosts});
      Object.freeze(instance);
      lastUpdated = new Date();
    }
    else {
      // log.info("Not updating feConfig");      
    }
  }

  async function getRaw() {
    if (!raw || (new Date() - lastUpdated) > 1000 * 15) {
      await updateData();
    }
    return raw;
  };

  async function getIstance() {
    if (!instance || (new Date() - lastUpdated) > 1000 * 15) {
      await updateData();
    }
    return instance;
  };

  return {
    getRaw: () => getRaw(),
    getIstance: () => getIstance(),
    getHosts: () => getIstance().then(instance => instance.hosts),
    getHost: (hostName) => getIstance().then(instance => {
      if (!instance.hosts.hasOwnProperty(hostName)) {
        let err = new Error(`Could not find host ${hostName}`);
        throw err;
      }
      return instance.hosts[hostName];
    }),
  };
})();

export default FeConfigSingleton;