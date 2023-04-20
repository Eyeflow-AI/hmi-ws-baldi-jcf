import log from './log';
import Mongo from '../components/mongo';

const auditMiddleware = () => (req, res, next) => {

  res.on('finish', () => {
    const method = req?.method?.toLowerCase();
    const url = req?.url;
    const requestId = req?.app?.requestId;
    const body = { ...req?.body } ?? {};
    const query = { ...req?.query } ?? {};
    const params = { ...req?.params } ?? {};
    const tokenData = { ...req?.app?.auth } ?? {};
    const reqIp = (
      req.headers['cf-connecting-ip'] ||
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress || ''
    ).split(',')[0].trim();
    const wsIp = req.get('host');

    if (body.password) {
      body.password = "******";
    };
    if (tokenData.password) {
      tokenData.password = "******";
    };

    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      let auditData = {
        request_id: requestId,
        success: res.statusCode < 400,
        method,
        url,
        req_ip: reqIp,
        ws_ip: wsIp,
        route_path: req?.route?.path ?? "",
        query,
        params,
        body,
        token_data: tokenData,
        version: 1
      }

      Mongo.db.collection("audit").insertOne(auditData)
        .then(()=>null)
        .catch(() => log.audit(`Failed to insert audit data: ${JSON.stringify(auditData)}`));
    }; //TODO: Send to Sergio?
 });
  next();
};

export default auditMiddleware;