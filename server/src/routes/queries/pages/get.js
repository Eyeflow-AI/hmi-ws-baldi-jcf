import Mongo from "../../../components/mongo";

async function get(req, res, next) {

  try {
    let queriesDocument = await Mongo.db.collection("params").findOne({ name: 'queries' });
    if (queriesDocument) {
      res.status(200).json({ ok: true, result: queriesDocument?.queries });
    }
    else {
      res.status(200).json({ ok: true, result: [] });
    }

  }
  catch (err) {
    next(err);
  };
};

export default get;