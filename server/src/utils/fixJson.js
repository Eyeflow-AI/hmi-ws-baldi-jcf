const Mongo = require('../components/mongo');

function fixJson(data, parentKey, parentData) {
  try {
    if (Array.isArray(data)) {
      for (let i = 0; i< data.length; i++) {
        if (data[i] !== null && typeof data[i] === 'object')  {
          data[i] = fixJson(data[i]);
        }
      };
    }
    else {
      for ([key, value] of Object.entries(data)) {
        if (value !== null && typeof value === 'object') {
          fixJson(data[key], key, data);
        }
        else if (key === '$date'){
          parentData[parentKey] = new Date(data[key]);
        }
        else if (key === '$oid'){
          parentData[parentKey] = Mongo.ObjectId(data[key]);
        };
      };
    };
    return data;
  }
  catch (err) {
    err.message = `Error in fixJson function: ${err.message}`;
    throw err;
  };
};

module.exports = fixJson;