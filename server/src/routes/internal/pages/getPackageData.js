// /**
// * 
// */

const DATA_PATH = `${process.env.DATA_PATH}/package_data`;
const PACKAGE_ID = process.env.PACKAGE_ID;

function getPackageData(req, res, next) {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(`${DATA_PATH}/${PACKAGE_ID}.json`);
  }
  catch (err) {
    console.log({ err })
    res.status(204).json({ msg: 'file not found' })
  }
};

export default getPackageData;