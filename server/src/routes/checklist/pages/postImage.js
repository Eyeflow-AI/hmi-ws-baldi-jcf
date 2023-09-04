import fs from 'fs';
import fsx from 'fs-extra';

const postImage = async (req, res) => {

  // save base64 image in file system
  const base64Data = req.body.image;
  let fileName = req.body.name;
  // const path = `/opt/eyeflow/data/framework-tools/checklist-connector/images`;
  const path = `/data/framework-tools/checklist-connector/images`;
  fsx.ensureDirSync(path);

  const imageBuffer = Buffer.from(base64Data, 'base64');
  if (base64Data !== '' && fileName !== '') {
    try {
      // Write the file synchronously
      fileName = `${fileName}.jpg`;
      const outputFilePath = `${path}/${fileName}`;
      fs.writeFileSync(outputFilePath, imageBuffer);

      console.log(`File "${fileName}" has been written successfully.`);
      res.status(200).json({ msg: `File "${fileName}" has been written successfully.` });
    } catch (err) {
      console.error('Error writing file:', err);
      res.status(500).json({ msg: 'Error writing file.' });
    }
  }
  else {
    console.log('No image data or file name provided.');
    res.status(400).json({ msg: 'No image data or file name provided.' });
  }
}

export default postImage;