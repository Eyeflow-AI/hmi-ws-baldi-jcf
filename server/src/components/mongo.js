import { MongoClient, ObjectId } from 'mongodb';

const Mongo = {
  ObjectId
};

async function connect({ mongoURL, mongoDB }) {
  return new Promise(async (resolve, reject) => {
    try {
      const client = new MongoClient(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true });
      const db = (await client.connect()).db(mongoDB);
      if (db) {
        console.log(`Connected to mongo db ${mongoDB} successfully`);
        resolve({ db, client, mongoURL });
      }
      else {
        let err = new Error();
        reject(err);
      }
    }
    catch (err) {
      console.log(err);
      process.exit(1);
      reject(err);
    }
  })
};

Mongo.connect = connect;

// module.exports = Mongo;

export default Mongo;