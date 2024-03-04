async function checkVersion(req, res, next) {
  let versionUrl = `${req.headers.referer}/version`;
  const response = await fetch(versionUrl);

  try {
    if (response.status !== 200) {
      res.send({ reload: true  });
    } else {
      res.send({ reload: false });
    }
  }
  catch (err) {
    next(err);
  }
}

export default checkVersion;
