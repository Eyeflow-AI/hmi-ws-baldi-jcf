import Mongo from "../../../components/mongo";
import isIsoDate from "../../../utils/isIsoDate";

async function getConfigForFE(req, res, next) {

  try {
    let feConfig = await Mongo.db.collection('params').findOne({
      'name': 'feConfig'
    })

    // if (process.env.NODE_ENV === "development") {
    //   output.queryOptions = { match, projection, collection, limit };
    // };

    res.status(200).json(feConfig);
  }
  catch (err) {
    next(err);
  };
};

export default getConfigForFE;