// create a fucntion that deletes the first item of an array in a json document
import path from 'path';
import fs from 'fs';

function resetDatasetFilesImagesCapture(req, res, next) {
  console.log('resetDatasetFilesImagesCapture', req.body);
  const datasetsPath = path.join('/opt/eyeflow/data/framework-tools/images-capturer/images-to-upload/datasets.json');

  try {
    const data = JSON.parse(fs.readFileSync(datasetsPath, 'utf-8'));

    for (const key in data) {
      if (Array.isArray(data[key]) && data[key].length > 0) {
        data[key].shift(); // Remove the first item of the array
      }
    }

    fs.writeFileSync(datasetsPath, JSON.stringify(data, null, 2));
    console.log('First item deleted from the list in the JSON document.');
  } catch (error) {
    console.error('An error occurred:', error);
  }

  res.status(200).json({ ok: true });
}

export default resetDatasetFilesImagesCapture;