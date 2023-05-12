function parseIntThrowError(value, errMessage=null) {

  let parsed = parseInt(value);
  if (isNaN(parsed)) {
    if (!errMessage) {
      errMessage = `Failed to parse ${value} as integer`;
    }
    let err = new Error(errMessage);
    err.status = 400;
    throw err;
  }
  return parsed;
}

module.exports = parseIntThrowError;