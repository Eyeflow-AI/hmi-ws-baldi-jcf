import Mongo from "../../../components/mongo";
import stringToSHA256 from "../../../utils/stringToSHA256";
import getUserToken from "../utils/getUserToken";
import verifyToken from "../utils/verifyToken";
import getUserControlData from "../utils/getUserControlData";
import getAccessControlDocument from "../utils/getAccessControlDocument";

async function loginByIp(req, res, next) {
  try {
    const clientIP = (
      req.headers["cf-connecting-ip"] ||
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      ""
    )
      .split(",")[0]
      .trim();

    console.log({ clientIP });

    let userRole = "";
    let username = "";
    let ipsDocument = await Mongo.db
      .collection("params")
      .findOne({ name: "allowed_ips" });

    if (!ipsDocument) {
      res
        .status(201)
        .json({ ok: false, message: "Document not found, login by Ip failed" });
    } else {
      let machine = null;
      if (ipsDocument?.allowed_ips.length === 0) {
        res
          .status(201)
          .json({ ok: false, message: "Allowed IPs list list is empty" });
      } else {
        machine = ipsDocument?.allowed_ips.find((machine) => {
          return (
            machine.ip === clientIP && {
              ip: machine.ip,
              role: machine.role,
              username: machine.username,
            }
          );
        });
      }

      if (Object.keys(machine ?? {}).length === 0) {
        res.status(201).json({
          ok: false,
          message: "Automatic login is not allowed for this IP",
        });
      } else {
        userRole = machine.role;
        username = machine.username;
      }

      let err, token, tokenPayload;
      let accessControlData = await getAccessControlDocument();
      let userDocument = await Mongo.db
        .collection("user")
        .findOne({ "auth.username": username });

      if (!userDocument) {
        res
          .status(201)
          .json({ ok: false, message: "User not found in database" });
      } else {
        userDocument.auth.accessControl = getUserControlData(
          accessControlData,
          userRole
        );
        [err, token] = getUserToken(userDocument);
        if (err) {
          throw err;
        }

        [err, tokenPayload] = verifyToken(token);
        if (err) {
          throw err;
        }
        return res.status(201).json({ ok: true, token, tokenPayload });
      }
    }
  } catch (err) {
    return next(err);
  }
}

export default loginByIp;
