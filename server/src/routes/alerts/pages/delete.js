import Mongo from "../../../components/mongo";


async function _delete(req, res, next) {
  try {
    let alertId = req.params.alertId;
    let result = await Mongo.db.collection('alert').updateOne({ _id: Mongo.ObjectId(alertId) }, { $set: { active: false, deletedDate: new Date() } });
    if (result.acknowledged && result.modifiedCount === 1) {
      res.status(200).json({ ok: true, msg: 'alert deleted' });
    }
    else {
      let err = new Error(`Could not delete alert with id ${alertId}`);
      throw err;
    }
  }
  catch (err) {
    next(err);
  }
};

export default _delete;