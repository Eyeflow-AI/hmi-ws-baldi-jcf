import getPartsDocument from "../../../utils/getPartsDocument";
import hashObj from "../../../utils/hashObj";

async function getList(req, res, next) {

  try {

    let result = await getPartsDocument();

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