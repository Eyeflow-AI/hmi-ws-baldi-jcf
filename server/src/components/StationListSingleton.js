import Mongo from "./mongo"
import log from "../utils/log";

const StationListSingleton = (() => {
//   let raw;
  let instance;
  let lastUpdated;

  async function updateData() {
    let sort = { label: 1 };
    let stationList = await Mongo.db.collection('station').find({}).sort(sort).toArray();
    log.info("Updating stationList");
    // raw = JSON.parse(JSON.stringify(stationList));
    // Object.freeze(raw);
    Object.freeze(stationList);
    instance = stationList;
    lastUpdated = new Date();
  }

//   async function getRaw() {
//     if (!raw || (new Date() - lastUpdated) > 1000 * 15) {
//       await updateData();
//     }
//     return raw;
//   };

  async function getInstance() {
    if (!instance || (new Date() - lastUpdated) > 1000 * 15) {
      await updateData();
    }
    return instance;
  };

  return {
    // getRaw: () => getRaw(),
    getInstance: () => getInstance(),
    getStationByStationId: async (stationId) => {
      if (!Mongo.ObjectId.isValid(stationId)) {
        let err = new Error(`stationId ${stationId} is not a valid ObjectId`);
        err.status = 400;
        throw err;
      }
      let stationData = await getInstance().then(instance => instance.find(station => String(station._id) === stationId));
      if (!stationData) {
        let err = new Error(`Could not find station with stationId ${stationId}`);
        err.status = 400;
        throw err;
      }
      return stationData;
    },
  };
})();

export default StationListSingleton;