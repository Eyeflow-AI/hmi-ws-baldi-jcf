import Mongo from "../../../components/mongo";
import stringToSHA256 from "../../../utils/stringToSHA256";
import getUserToken from "../utils/getUserToken";
import verifyToken from "../utils/verifyToken";

const defaultPassword = stringToSHA256(process.env.USER_DEFAULT_PASSWORD);



/**
* @param {string} [body.username] - name of the user.
* @param {string} [body.password] - password of the user.
*/

async function login(req, res, next) {

  try {
    let { username, password } = req.body;
    if (!(username && password)) {
      let err = new Error(`Body keys username and password cannot be empty`);
      err.status = 400;
      next(err);
    }
    else {
      let userDocument = await Mongo.db.collection('user').findOne({ 'auth.username': username });
      if (userDocument) {
        let userPassword = userDocument.auth?.password ?? defaultPassword;
        if (userPassword === stringToSHA256(password)) {
          let [err, token] = getUserToken(userDocument);
          if (err) {
            next(err);
          }
          else {
            let [err, tokenPayload] = verifyToken(token);
            console.log(err)
            res.status(201).json({ ok: true, token, tokenPayload });
          }
        }
        else {
          let err = new Error(`Wrong username/password`);
          err.status = 400;
          next(err);
        };
      }
      else {
        let err = new Error(`Wrong username/password`);
        err.status = 400;
        next(err);
      };
    }
  }
  catch (err) {
    next(err);
  };
};

export default login;