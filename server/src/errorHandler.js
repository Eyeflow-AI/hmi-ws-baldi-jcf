import log from './utils/log';
import getRequestId from './utils/getRequestId';


export default function errorHandler (err, req, res, next) {
  console.log("OXE")
  let requestId = getRequestId(req);
  try {
    log.error(`Request ${requestId}. Error: ${JSON.stringify(err.message)}. Stack: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
  }
  catch (err) {
    log.error(`Request ${requestId}. Error: ${JSON.stringify(err.message)}. Failed to get error stack.`);
  };
  res.status(err.status || 500).json({ requestId, err: err.message, data: err.extraData });
};