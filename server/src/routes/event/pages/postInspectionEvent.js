import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';
import axios from 'axios';
import fs from 'fs';

async function saveImage(imageObj) {

  console.log({imageObj})
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(imageObj.absolute_image_path)) {
      // Create the directory
      fs.mkdirSync(imageObj.absolute_image_path, { recursive: true });
      console.log('Directory created successfully.');
    } else {
      console.log('Directory already exists.');
    }
    // Save the image to a file

    // check if file exists
    if (fs.existsSync(`${imageObj.absolute_image_path}/${imageObj.image_file}`)) {
      resolve();
    } else {
      console.log('File does not exist.');
      // Fetch the image
      axios.get(imageObj.url, { responseType: 'arraybuffer' })
        .then(response => {
          fs.writeFileSync(`${imageObj.absolute_image_path}/${imageObj.image_file}`, response.data);
          console.log('Image saved successfully.');
          resolve();
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          resolve();
        });
    }

  });
};

async function postInspectionEvent(req, res, next) {

  try {
    let ipv4Address;
    const ipv4Pattern = /::ffff:(\d+\.\d+\.\d+\.\d+)/;
    const clientIP = req.connection.remoteAddress;
    const match = clientIP.match(ipv4Pattern);


    let event = req.body;
    event = JSON.stringify(event);
    event = EJSON.parse(event);
    if (event?.event_host) {
      event.host = event.event_host;
      ipv4Address = event.event_host;
      delete event.event_host;
    }
    else {
      event.host = clientIP;
      if (match && match.length >= 2) {
        ipv4Address = match[1];
        console.log("IPv4 address:", ipv4Address);
      } else {
        console.log("No IPv4 address found.");
      }
    }

    const station = await Mongo.db.collection('station').findOne({ 'edges.host': `http://${ipv4Address}` });
    const edge = station?.edges.find(edge => edge.host === `http://${ipv4Address}`);
    const host = edge?.host ?? '';
    const filesPort = edge?.filesPort ?? '';
    const url = `${host}:${filesPort}/eyeflow_data/event_image`;
    const imagesList = [];

    let urlControl = [];
    event?.event_data?.inspection_result?.check_list?.region?.forEach(region => {
      // let full_url = `${url}/${region?.image?.image_path ?? region?.image_path}/${region?.image?.image_file ?? region?.image_file}`;
      let full_url = `${url}${region?.image?.absolute_image_path ?? region?.absolute_image_path}}/${region?.image?.image_file ?? region?.image_file}`
      if (!urlControl.includes(full_url)) {
        urlControl.push(full_url);
        imagesList.push({
          url: full_url,
          absolute_image_path: region?.image?.absolute_image_path ?? region?.absolute_image_path,
          image_file: region?.image?.image_file ?? region?.image_file
        })
      };
      region?.tests?.forEach(test => {
        test?.detections?.forEach(detection => {
          if (detection?.image?.image_path && detection?.image?.image_file) {
            let full_url = `${url}${detection?.image?.absolute_image_path ?? detection?.absolute_image_path}/${detection?.image?.image_file ?? detection?.image_file}`
            if (!urlControl.includes(full_url)) {
              urlControl.push(full_url);
              imagesList.push({
                url: full_url,
                absolute_image_path: detection?.image?.absolute_image_path ?? detection?.absolute_image_path,
                image_file: detection?.image?.image_file ?? detection?.image_file
              })
            };
          }
        })
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



