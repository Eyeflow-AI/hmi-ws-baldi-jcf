import Mongo from "../../../components/mongo";
import stringToSHA256 from "../../../utils/stringToSHA256";
import getUserToken from "../utils/getUserToken";
import verifyToken from "../utils/verifyToken";
import getUserControlData from '../utils/getUserControlData';
import getAccessControlDocument from '../utils/getAccessControlDocument';


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
      throw err;
    };

    let userDocument = await Mongo.db.collection('user').findOne({ 'auth.username': username });
    let userPassword = userDocument?.auth?.password ?? defaultPassword;

    if (!userDocument || (userPassword !== stringToSHA256(password))) {
      let err = new Error(`Wrong username/password`);
      err.status = 400;
      throw err;
    };

    let err, token, tokenPayload;
    let accessControlData = await getAccessControlDocument();
    userDocument.auth.accessControl = getUserControlData(accessControlData, userDocument.auth.role);
    [err, token] = getUserToken(userDocument);
    if (err) {
      throw err;
    };

    [err, tokenPayload] = verifyToken(token);
    if (err) {
      throw err;
    };

    return res.status(201).json({ ok: true, token, tokenPayload });
  }
  catch (err) {
    return next(err);
  };
};

export default login;