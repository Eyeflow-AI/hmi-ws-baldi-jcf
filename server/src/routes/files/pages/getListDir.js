const fs = require('fs');

import Mongo from "../../../components/mongo";

async function getListDir(req, res, next) {
  try {
    let dirPath = req.query.dirPath;
    if (!dirPath) {
      let err = new Error(`query parm dirPath is required`);
      err.status = 400;
      throw err;
    };

    let depth = parseInt(req.query.depth) ?? 0;
    if (isNaN(depth)) {
      let err = new Error(`query parm depth should be a valid int value`);
      err.status = 400;
      throw err;
    };

    let fileURL = Boolean(req.query.fileURL);
    let hosts;
    if (fileURL) {
      let document = await Mongo.db.collection('params').findOne({'name': 'feConfig'}, {projection: {_id: false, hosts: true}})
      if (!document) {
        let err = new Error(`Could not find feConfig document`);
        throw err;
      };
      hosts = document.hosts;
    };

    let stationId = req.params.stationId;

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
      };
      if (fileURL) {
        fileData.fileURL = `${hosts['hmi-files-ws'].url}/${filePath}`.replace('/opt/eyeflow', '')
      };
      return fileData;
    });

    res.status(200).json({ ok: true, files, debug: {depth, stationId, fileURL, hosts}, query: req.query});    
  }
  catch (err) {
    next(err);
  }
};

export default getListDir;