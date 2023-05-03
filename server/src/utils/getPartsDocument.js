import Mongo from "../components/mongo";

function getPartsDocument() {

  return new Promise((resolve, reject) => {
      
      let collection = "params";
      Mongo.db.collection(collection).findOne({"name": "parts_register"})
        .then(result => {
          if (!result) {
            let err = new Error("Did not find parts_register document in params collection");
            reject(err);
          }
          else {
            resolve(result);
          }
        })
        .catch(err => {
          reject(err);
        });
  });
};

export default getPartsDocument;