import Mongo from "../../../components/mongo";
import hashObj from "../../../utils/hashObj";

async function getList(req, res, next) {

  try {

    let collection = "parts";
    let sort = {part_id: 1};
    let partsList = await Mongo.db.collection(collection).find({}).sort(sort).toArray();
    let partsListLength = partsList.length;

    let output = {
      ok: true,
      partsListLength,
      partsList,
      hash: partsListLength > 0 ? hashObj(partsList) : null,
    };

    res.status(200).json(output);
  }
  catch (err) {
    next(err);
  };
};

export default getList;