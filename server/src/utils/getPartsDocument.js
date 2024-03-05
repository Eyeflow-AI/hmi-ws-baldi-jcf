import Mongo from "../components/mongo";
import fetchJson from "./fetchJson";

function getPartsDocument(origin, url) {
  return new Promise((resolve, reject) => {
    if (origin === "parts_register") {
      let collection = "params";
      Mongo.db
        .collection(collection)
        .findOne({ name: "parts_register" })
        .then((result) => {
          if (!result) {
            let err = new Error(
              "Did not find parts_register document in params collection"
            );
            reject(err);
          } else {
            resolve(result);
          }
        })
        .catch((err) => {
          reject(err);
        });
    } else if (origin === "maskMapList") {
      fetchJson(url)
        .then((maskMapList) => {
          let result = {
            parts_list: [],
          };
          result["parts_list"] = maskMapList.map(
            (maskMap) => maskMap?.annotations?.part_data
          );
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}

export default getPartsDocument;
