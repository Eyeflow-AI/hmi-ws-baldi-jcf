import path from 'path';
import fs from 'fs';

function deleteFile(req, res, next) {
  const { file } = req.body;
  const filePath = path.join(file);

  const fileName = path.basename(filePath);


  console.log({ fileName, filePath });


  if (!fileName.endsWith('.jpg') && !fileName.endsWith('.json') && !file.includes('.') && !fileName.endsWith('.tar.gz')) {
    console.log('Invalid file name')
    res.status(400).json({ message: 'Invalid file name' });
    return;
  }

  if (filePath.includes('/opt/eyeflow/src')) {
    console.log('Invalid file path')
    res.status(400).json({ message: 'Invalid file path' });
    return;
  }

  if (!filePath.includes('/opt/eyeflow/data/framework-tools')) {
    console.log('Invalid file path de novo')
    res.status(400).json({ message: 'Invalid file path' });
    return;
  }


  try {
    fs.unlinkSync(filePath);
    console.log(`File ${fileName} deleted successfully!`);
  } catch (error) {
    console.error('Error while deleting file:', error);
  }

  res.status(200).json({ fileName });
}

export default deleteFile;