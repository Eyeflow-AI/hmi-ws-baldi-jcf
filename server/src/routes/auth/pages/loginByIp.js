import Mongo from "../../../components/mongo";
import stringToSHA256 from "../../../utils/stringToSHA256";
import getUserToken from "../utils/getUserToken";
import verifyToken from "../utils/verifyToken";
import getUserControlData from '../utils/getUserControlData';
import getAccessControlDocument from '../utils/getAccessControlDocument';

async function loginByIp(req, res, next) {

  try {
    const clientIP = req.connection.remoteAddress;
    let userRole = ""
    let username = ""
    let ipsDocument = await Mongo.db.collection("params").findOne({ name: 'allowed_ips' });

    ipsDocument.allowed_ips.map((machine) => {
      if (machine.ip === clientIP) {
        userRole = machine.role;
        username = machine.username;
      } else {
        let err = new Error(`Automatic login is not allowed for this IP`);
        err.status = 400;
        throw err;
      }
    });

    let err, token, tokenPayload;
    let accessControlData = await getAccessControlDocument();
    let userDocument = await Mongo.db.collection('user').findOne({ 'auth.username': username });

    userDocument.auth.accessControl = getUserControlData(accessControlData, userRole);

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

export default loginByIp;