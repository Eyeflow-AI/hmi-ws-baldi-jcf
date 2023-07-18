import StationListSingleton from "../../../components/StationListSingleton";
import {getConfig} from "./getConfigForFE";

async function getConfigForStationFE(req, res, next) {

  const stationId = req.params.stationId;
  try {
    let [output, stationData] = await Promise.all([
        getConfig(),
        StationListSingleton.getStationByStationId(stationId)
    ]);
    output.stationData = stationData;
    res.status(200).json(output);
  }
  catch (err) {
    next(err);
  };
};

export default getConfigForStationFE;