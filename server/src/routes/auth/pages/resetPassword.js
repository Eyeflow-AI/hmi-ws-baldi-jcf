import Mongo from "../../../components/mongo";
import stringToSHA256 from "../../../utils/stringToSHA256";
import getMissingKeysFromObject from "../../../utils/getMissingKeysFromObject";

const requiredKeys = ["username", "newPassword"];

async function resetPassword(req, res, next) {
  try {
    let body = req.body;
    let missingKeys = getMissingKeysFromObject(body, requiredKeys);
    let username = req?.body?.username ?? "";

    if (missingKeys.length === 0) {
      let userDocument = await Mongo.db
        .collection("user")
        .findOne({ "auth.username": username });
      if (userDocument) {
        let newPassword = stringToSHA256(body.newPassword);
        let result = await Mongo.db
          .collection("user")
          .updateOne(
            { _id: userDocument._id },
            { $set: { "auth.password": newPassword } }
          );

        if (result.modifiedCount === 1) {
          res.status(200).json({ ok: true });
        } else {
          let err = new Error(`User ${username} password did not change`);
          err.status = 400;
          next(err);
        }
      } else {
        let err = new Error(`Wrong username/password`);
        err.status = 400;
        next(err);
      }
    } else {
      let err = new Error(
        `The following keys are missing from the request body: ${missingKeys.join(
          ", "
        )}`
      );
      err.status = 400;
      next(err);
    }
  } catch (err) {
    next(err);
  }
}

export default resetPassword;
