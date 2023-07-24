import Mongo from "../../../components/mongo";
import StationListSingleton from "../../../components/StationListSingleton";

async function getList(req, res, next) {

  try {
    let stationList = await StationListSingleton.getInstance();
    let stationListLength = stationList.length;
    let output = {
      ok: true,
      stationListLength,
      stationList,
    };

    res.status(200).json(output);
  }
  catch (err) {
    next(err);
  };
};

export default getList;