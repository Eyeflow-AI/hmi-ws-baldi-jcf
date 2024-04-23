import Mongo from "../../../components/mongo";

async function postComponent(req, res, next) {
  try {
    let name = req.body.name;
    if (!name) {
      res.status(400).json({ ok: false, message: "Name is required" });
      return;
    }
    let document = {
      name,
      document: `// MONGO can be used to store and retrieve data
// Example: MONGO.db.collection("scripts").find()
// Example: MONGO.url
// Example: MONGO.client
// Example: MONGO.ObjectId

// AXIOS can be used to access data from external sources
function ${name}({obj}) {
  console.log('Hello, World!');
  return null;
}

tagOutput = ${name}({obj: {{variable}}}); // tagOutput is a variable waiting to be delivered to front end
      `,
    };
    await Mongo.db.collection("components").insertOne(document);
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export default postComponent;
