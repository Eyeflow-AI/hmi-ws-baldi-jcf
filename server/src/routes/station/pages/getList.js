import Mongo from "../../../components/mongo";


async function getList(req, res, next) {

  try {
    let collection = "station";
    // let projection = {};
    let sort = { label: 1 };
    let stationList = await Mongo.db.collection(collection).find({}).sort(sort).toArray();
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