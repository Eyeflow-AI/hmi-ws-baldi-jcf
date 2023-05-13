import appRootPath from 'app-root-path';
const PATH = `${appRootPath}/assets/images/`;

async function getImage(req, res, next) {
  const image = req?.params?.name ?? '';
  if (image) {
    try {
      res.setHeader('Content-Type', 'image/jpg');
      res.sendFile(`${PATH}/${image}.jpg`);
    }
    catch (err) {
      console.log({ err })
      res.status(204).json({ msg: 'image to query not found' })
    }
  }
  else {
    res.status(204).json({ msg: 'image to query not informed' })
  }

}


export default getImage;