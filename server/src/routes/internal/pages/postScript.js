import Mongo from "../../../components/mongo";

async function postScript(req, res, next) {
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
function ${name}() {
  console.log('Hello, World!');
  return null;
}

result = ${name}(); // result is a variable that must to be used
      `,
    };
    await Mongo.db.collection("scripts").insertOne(document);
    res.status(200).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export default postScript;
