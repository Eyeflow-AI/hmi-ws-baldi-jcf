# bristol

from pymongo import MongoClient
from bson import ObjectId
import datetime

MONGO_URL = "mongodb://eyeflow:eyeflow@localhost:27017/?authSource=admin&readPreference=primary&ssl=false"
MONGO_DB = "bristol"
db = MongoClient(MONGO_URL)[MONGO_DB]

db["batch"].insert_one({
      "_id": ObjectId("641b3edf6167cbfdef5380e2"),
      "station": ObjectId("641b3a9af742dd9ea6d0416c"),
      "start_time": datetime.datetime.now(),
      "status": "running",
      "pack_list": {},
      "info": {
          "pack_qtt": 10,
          "parts_per_pack": 100,
      }
})

db["station"].insert_one({
    "_id": ObjectId("641b3a9af742dd9ea6d0416c"),
    "label": "Dev-Station",
    "slugLabel": "dev",
    "parms": {
        "wsURL": "http://localhost:6030"
    }
})