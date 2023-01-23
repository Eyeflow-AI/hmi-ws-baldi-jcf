import { MongoClient, ObjectId } from 'mongodb';

const Mongo = {
  ObjectId
};

async function connect(mongoURL, mongoDB) {
  const client = new MongoClient(mongoURL);
  try {
    Mongo.client = client;
    await Mongo.client.connect();
    Mongo.db = client.db(mongoDB);
    Mongo.parms = {
      db: mongoDB,
      url: mongoURL
    };
    console.log(`Connected to mongo db ${mongoDB} successfully`);
    return Mongo;
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }
};

Mongo.connect = connect;

// module.exports = Mongo;

export default Mongo;