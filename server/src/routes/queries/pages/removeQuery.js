import Mongo from "../../../components/mongo";

async function removeQuery(req, res, next) {

  try {
    let queryName = req?.body?.queryName ?? '';
    if (queryName) {
      await Mongo.db.collection("params").updateOne({ name: 'queries' }, {
        $unset: {
          [`custom_queries.${queryName}`]: ''
        }
      })
      res.status(200).json({ ok: true });

    }
    else {
      res.status(400).json({ ok: false, message: 'missing_parameters' });
    }

  }
  catch (err) {
    next(err);
  };
};

export default removeQuery;