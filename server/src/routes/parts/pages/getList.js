import Mongo from "../../../components/mongo";
import hashObj from "../../../utils/hashObj";

async function getList(req, res, next) {

  try {

    let collection = "params";
    let result = await Mongo.db.collection(collection).findOne({"name": "parts_register"});
    if (!result) {
      throw new Error("Did not find parts_register document in params collection");
    };

    let partsListLength = result.parts_list.length;

    let output = {
      ok: true,
      partsListLength,
      partsList: result.parts_list,
      hash: partsListLength > 0 ? hashObj(result.parts_list) : null,
    };

    res.status(200).json(output);
  }
  catch (err) {
    next(err);
  };
};

export default getList;