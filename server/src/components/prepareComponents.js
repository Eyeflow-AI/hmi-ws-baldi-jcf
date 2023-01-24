import Mongo from './mongo';

function prepareComponents({ mongoURL, mongoDB }) {
  let promises = [
    Mongo.connect({ mongoURL, mongoDB }),
  ];

  Promise.all(promises);
};

export default prepareComponents;