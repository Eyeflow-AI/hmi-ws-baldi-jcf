const fs = require('fs');

function createFolderIfNotExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Folder created: ${directory}`);
  } else {
    console.log(`Folder already exists: ${directory}`);
  }
}

function saveJsonToFile(jsonPath, jsonData) {
  try {

    fs.writeFileSync(jsonPath, jsonData);

    console.log(`Data saved to ${jsonPath}`);
  } catch (err) {
    console.error('Error while saving JSON data to file:', err);
    throw err;
  }
}

function decodeBase64ToFile(
  outputFilePath,
  base64String
) {
  const bufferData = Buffer.from(base64String, 'base64');

  fs.writeFile(outputFilePath, bufferData, (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      throw err
    } else {
      console.log('File has been successfully decoded and written:', outputFilePath);
    }
  });
}

function addValueToArray(filePath, newValue) {
  let json = {};

  try {
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      json = JSON.parse(data);
    }

    if (!Array.isArray(json.files)) {
      json.files = [];
    }

    json.files.push(newValue);

    const updatedJSON = JSON.stringify(json, null, 2);

    fs.writeFileSync(filePath, updatedJSON, 'utf-8');
    console.log(`Value '${newValue}' added to the array in the JSON file successfully!`);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function uploadImageInfo(req, res, next) {

  try {
    const folderPath = "/opt/eyeflow/data/framework-tools/images-capturer/images-to-upload/"
    const ObjectId = require('mongodb').ObjectId;
    const datasetId = req.body.data.dataset_id;
    const maskMap = req.body.maskMap;

    const objectId = new ObjectId();

    const datasetPath = `${folderPath}${datasetId}`
    const imagePath = `${datasetPath}/${objectId}.jpg`;
    const jsonPath = `${datasetPath}/${objectId}_data.json`;
    const thumbPath = `${datasetPath}/${objectId}_thumb.jpg`;

    const file = `${folderPath}datasets.json`;
    const valueToAdd = { datasetId, imagePath, jsonPath, thumbPath };

    const base64String = req.body.imageBase64.split(',')[1];

    addValueToArray(file, valueToAdd);

    const jsonData = req.body.data;
    const updateJson = {
      ...jsonData,
      _id: objectId,
      feedback: {},
      options: null,
      example_path: jsonData.dataset_id,
      example_thumb: `${objectId}_thumb.jpg`,
    }

    if (maskMap) {
      updateJson.annotations = {
        ...jsonData.annotations,
        mask_map: []
      }
    } else {
      updateJson.annotations = {
        ...jsonData.annotations,
        instances: []
      }
    }

    const jsonString = JSON.stringify(updateJson, null, 2);

    createFolderIfNotExists(datasetPath)
    saveJsonToFile(jsonPath, jsonString);
    decodeBase64ToFile(imagePath, base64String);

    res.status(201).json({
      ok: true
    });


  } catch (err) {
    next(err);
  }
}

export default uploadImageInfo;
