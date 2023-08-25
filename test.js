const axios = require('axios');
const fs = require('fs');

axios.get('http://localhost:6031/eyeflow_data/event_image/20230813/64d997858422aca8b63a6b0f.jpg', { responseType: 'arraybuffer' })
  .then(response => {
    // Save the image to a file
    fs.writeFileSync(`/opt/eyeflow/64d997858422aca8b63a6b0f.jpg`, Buffer.from(response.data));
    console.log('Image saved successfully.');
    resolve();
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    resolve();
  });