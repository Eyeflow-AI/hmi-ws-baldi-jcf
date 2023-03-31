import log from './log';
import Mongo from '../components/mongo';

const auditMiddleware = () => (req, res, next) => {

  res.on('finish', () => {
    const method = req?.method?.toLowerCase();
    const url = req?.url;
    const requestId = req?.app?.requestId;
    const body = { ...req?.body } ?? {};
    const tokenData = { ...req?.app?.auth } ?? {};

    if (body.password) {
      body.password = "******";
    };
    if (tokenData.password) {
      tokenData.password = "******";
    };

    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      Mongo.db.collection("audit").insertOne({
        request_id: requestId,
        status: res.statusCode < 400 ? "OK" : "NG",
        method,
        url,
        body,
        token_data: tokenData,
      })
        .then(()=>null)
        .catch(() => log.audit(`Failed to insert audit. ${method.toUpperCase()} - RequestId: ${requestId}. Status: ${res.statusCode < 400 ? "OK" : "NG"}. URL: ${url}. Body: ${JSON.stringify(body)} . Auth Info: ${JSON.stringify(token)}`))
    }; //TODO: Send to Sergio?
 });
  next();
};

export default auditMiddleware;