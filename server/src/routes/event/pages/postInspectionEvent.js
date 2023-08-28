import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';
import axios from 'axios';
import fs from 'fs';

async function saveImage(imageObj) {

  return new Promise(async (resolve, reject) => {
    // Fetch the image
    axios.get(imageObj.url, { responseType: 'arraybuffer' })
      .then(response => {
        // Save the image to a file
        if (!fs.existsSync(`/data/event_image/${imageObj.image_path}/`)) {
          // Create the directory
          fs.mkdirSync(`/data/event_image/${imageObj.image_path}/`);
          console.log('Directory created successfully.');
        } else {
          console.log('Directory already exists.');
        }
        fs.writeFileSync(`/data/event_image/${imageObj.image_path}/${imageObj.image_file}`, Buffer.from(response.data));
        console.log('Image saved successfully.');
        resolve();
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        resolve();
      });

  });
};


async function postInspectionEvent(req, res, next) {

  try {
    let event = req.body;
    event = JSON.stringify(event);
    event = EJSON.parse(event);
    const clientIP = req.connection.remoteAddress;
    event.host = clientIP;
    const ipv4Pattern = /::ffff:(\d+\.\d+\.\d+\.\d+)/;

    const match = clientIP.match(ipv4Pattern);

    let ipv4Address;

    if (match && match.length >= 2) {
      ipv4Address = match[1];
      console.log("IPv4 address:", ipv4Address);
    } else {
      console.log("No IPv4 address found.");
    }
    const station = await Mongo.db.collection('station').findOne({ 'parms.host': `http://${ipv4Address}` });
    const host = station?.parms?.host ?? '';
    const filesPort = station?.parms?.filesPort ?? '';
    const url = `${host}:${filesPort}/eyeflow_data/event_image`;
    const imagesList = [];

    event.event_data.inspection_result.check_list.region.forEach(region => {
      imagesList.push({
        url: `${url}/${region.image_path}/${region.image_file}`,
        image_path: region.image_path,
        image_file: region.image_file
      })
    });
    await Promise.all(imagesList.map(imageObj => saveImage(imageObj)));


    await Mongo.db.collection('inspection_events').insertOne(event);


    await Mongo.db.collection('staging_events').deleteMany({});
    res.status(201).json({
      ok: true
    });
  }
  catch (err) {
    next(err);
  };
};


export default postInspectionEvent;



