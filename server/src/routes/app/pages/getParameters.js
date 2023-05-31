import Mongo from "../../../components/mongo";

async function getParameters(req, res, next) {

  try {
    let documents = await Mongo.db.collection("params").find({}, {
      projection: {
        _id: 0,
        name: 1
      }
    }).toArray();
    if (documents) {
      res.status(200).json({ ok: true, documents });
    }
    else {
      res.status(200).json({ ok: true, documents });
    }

  }
  catch (err) {
    next(err);
  };
};

export default getParameters;