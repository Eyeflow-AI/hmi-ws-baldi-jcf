// /**
// * @param {string} [body.username] - name of the user.
// */


import fs from 'fs';
const DATA_PATH = `/package_data`;


function getPackageData(req, res, next) {
  try {
    let file = {};
    fs.readdirSync(DATA_PATH).forEach(f => {
      if (f.endsWith('.json')) {
        file = f;
      }
    });
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(`${DATA_PATH}/${file}`);
  }
  catch (err) {
    console.log({ err })
    res.status(204).json({ msg: 'file not found' })
  }
};

export default getPackageData;