import { MongoClient } from 'mongodb';
import { ObjectId } from 'bson';
import log from '../utils/log';

const Mongo = {
  ObjectId
};

async function connect({ mongoURL, mongoDB, maxPoolSize = 100, minPoolSize = 10 }) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = new MongoClient(
        mongoURL
        , {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          minPoolSize,
          maxPoolSize
        }
      );
      const db = (await client.connect()).db(mongoDB);
      if (db) {
        log.info(`Connected to mongo db ${mongoDB} successfully`);
        Mongo.db = db;
        Mongo.client = client;
        Mongo.url = mongoURL;
        resolve(true);
      }
      else {
        let err = new Error('Not able to connect to the database');
        reject(err);
      }
    }
    catch (err) {
      log.error(err);
      process.exit(1);
      reject(err);
    }
  })
};

Mongo.connect = connect;

// module.exports = Mongo;

export default Mongo;