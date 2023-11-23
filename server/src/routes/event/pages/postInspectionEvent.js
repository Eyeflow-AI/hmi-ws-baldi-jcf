import Mongo from "../../../components/mongo";
import { BSON, EJSON, ObjectId } from 'bson';
import axios from 'axios';
import fs from 'fs';
import IPV6toIPv4 from "../../../utils/ipv4Format";

async function saveFile(fileObj) {

  console.log({fileObj})
  return new Promise(async (resolve, reject) => {
    try {
      if (!fs.existsSync(fileObj.absolute_path)) {
        // Create the directory
        fs.mkdirSync(fileObj.absolute_path, { recursive: true });
        console.log('Directory created successfully.');
      } else {
        console.log('Directory already exists.');
      }
      // Save the image to a file
  
      // check if file exists
      if (fs.existsSync(`${fileObj.absolute_path}/${fileObj.file}`)) {
        resolve();
      } else {
        console.log('File does not exist.');
        // Fetch the image
        axios.get(fileObj.url, { responseType: 'arraybuffer' })
          .then(response => {
            fs.writeFileSync(`${fileObj.absolute_path}/${fileObj.file}`, response.data);
            console.log('Image saved successfully.');
            resolve();
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            resolve();
          });
      }
    }
    catch (err) {
      console.log({err});
      resolve();
    };
  });
};

async function postInspectionEvent(req, res, next) {

  try {
    let ipv4Address;
    const clientIP = req.connection.remoteAddress;


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
      ipv4Address = IPV6toIPv4(clientIP);
    }

    const station = await Mongo.db.collection('station').findOne({ 'edges.host': `http://${ipv4Address}` });
    const edge = station?.edges.find(edge => edge.host === `http://${ipv4Address}`);
    const host = edge?.host ?? '';
    const filesPort = edge?.filesPort ?? '';
    const url = `${host}:${filesPort}`;
    const imagesList = [];
    const metadataList = [];

    let urlControl = [];
    event?.event_data?.inspection_result?.check_list?.region?.forEach(region => {
      // let full_url = `${url}/${region?.image?.image_path ?? region?.image_path}/${region?.image?.image_file ?? region?.image_file}`;
      let full_url = `${url}${region?.image?.absolute_image_path ?? region?.absolute_image_path}/${region?.image?.image_file ?? region?.image_file}`
      if (!urlControl.includes(full_url)) {
        urlControl.push(full_url);
        imagesList.push({
          url: full_url,
          absolute_path: region?.image?.absolute_image_path ?? region?.absolute_image_path,
          file: region?.image?.image_file ?? region?.image_file
        });
        metadataList.push({
          url: full_url,
          absolute_path: region?.image?.metadata?.absolute_json_path ?? '',
          file: region?.image?.metadata?.json_file ?? ''
        });
      };
      region?.tests?.forEach(test => {
        test?.detections?.forEach(detection => {
          if (detection?.image?.image_path && detection?.image?.image_file) {
            let full_url = `${url}${detection?.image?.absolute_image_path ?? detection?.absolute_image_path}/${detection?.image?.image_file ?? detection?.image_file}`
            if (!urlControl.includes(full_url)) {
              urlControl.push(full_url);
              imagesList.push({
                url: full_url,
                absolute_path: detection?.image?.absolute_image_path ?? detection?.absolute_image_path,
                file: detection?.image?.image_file ?? detection?.image_file
              });
              metadataList.push({
                url: full_url,
                absolute_path: detection?.image?.metadata?.absolute_json_path ?? '',
                file: detection?.image?.metadata?.json_file ?? ''
              });
            };
          }
        })
      })
    }); 
    await Promise.all(imagesList.map(imageObj => saveFile(imageObj)));
    await Promise.all(metadataList.map(metadataObj => saveFile(metadataObj)));


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



