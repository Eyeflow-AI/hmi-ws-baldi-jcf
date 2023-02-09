import log from './log';

const auditMiddleware = () => (req, res, next) => {
  const method = req?.method?.toLowerCase();
  const url = req?.url;
  const requestId = req?.app?.requestId;
  const body = { ...req?.body } ?? {};
  const token = { ...req?.app?.auth } ?? {};

  delete body.password;
  delete token.password;
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    log.audit(`${method.toUpperCase()} - RequestId: ${requestId}. URL: ${url}. Body: ${JSON.stringify(body)} . Auth Info: ${JSON.stringify(token)}`);
  };
  next();
};

export default auditMiddleware;