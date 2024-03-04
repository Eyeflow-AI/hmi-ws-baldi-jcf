const fs = require('fs');

import FeConfigSingleton from "../../../components/FeConfigSingleton";

async function getListImages(req, res, next) {
  try {
    let dirPath = req.query.dirPath;
    let depth = 0;
    if (isNaN(depth)) {
      let err = new Error(`query parm depth should be a valid int value`);
      err.status = 400;
      throw err;
    };

    let fileURL = Boolean(req.query.fileURL);
    console.log(fileURL);
    let host;
    if (fileURL) {
      host = await FeConfigSingleton.getHost('hmi-files-ws');
    };

    let newDirPath = dirPath;
    if (newDirPath.startsWith('/opt/eyeflow/data')) {
      newDirPath = newDirPath.replace('/opt/eyeflow/data', 'eyeflow_data');
    }
    else if (newDirPath.startsWith('/data')) {
      newDirPath = newDirPath.replace('/data', 'eyeflow_data');
    };

    let files = (await fs.readdirSync(dirPath)).map((file) => {
      let filePath = `${dirPath}/${file}`;
      let stat = fs.lstatSync(filePath);
      // TODO depth != 0 logic
      let fileData = {
        name: file,
        birthtime: stat.birthtime,
        isDir: stat.isDirectory(),
        depth: 0,
        size: stat.size,
      };1
      if (fileURL) {
        fileData.fileURL = `${host.url}/${newDirPath}/${file}`;
      };
      return fileData;
    });

    res.status(200).json({ ok: true, files });
  }
  catch (err) {
    next(err);
  }
};

export default getListImages;
