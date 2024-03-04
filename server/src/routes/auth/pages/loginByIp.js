import Mongo from "../../../components/mongo";
import stringToSHA256 from "../../../utils/stringToSHA256";
import getUserToken from "../utils/getUserToken";
import verifyToken from "../utils/verifyToken";
import getUserControlData from '../utils/getUserControlData';
import getAccessControlDocument from '../utils/getAccessControlDocument';

async function loginByIp(req, res, next) {

  try {
    const clientIP = req.connection.remoteAddress;
    let userRole = "";
    let username = "";
    let ipsDocument = await Mongo.db.collection("params").findOne({ name: 'allowed_ips' });

    if (!ipsDocument) {
      res.status(201).json({ ok: false, message: 'Document not found' });
    } else {
      if (ipsDocument?.allowed_ips.length === 0) {
        res.status(201).json({ ok: false, message: 'Allowed IPs list is empty' });
      } else {
        ipsDocument?.allowed_ips.map((machine) => {
          if (machine.ip === clientIP) {
            userRole = machine.role;
            username = machine.username;
          } else {
            res.status(201).json({ ok: false, message: 'Automatic login is not allowed for this IP' });
          }
        });
      }

      let err, token, tokenPayload;
      let accessControlData = await getAccessControlDocument();
      let userDocument = await Mongo.db.collection('user').findOne({ 'auth.username': username });

      if (!userDocument) {
        res.status(201).json({ ok: false, message: 'User not found in database' });
      } else {
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
    }
  }
  catch (err) {
    return next(err);
  };
};

export default loginByIp;