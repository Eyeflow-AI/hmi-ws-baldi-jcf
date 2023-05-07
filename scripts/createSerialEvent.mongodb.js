/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('hmi_ws');

// Search for documents in the current collection.

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

// const part_id = String(create_UUID());
const part_id = 'aaaaaaaaaaaaaaaaaaa';
// const inspection_id = String(new ObjectId());
// const inspection_id = 'bbbbbbbbbbbbbbbbbbbbb';
const inspection_id = 'c';
const hostname = "edge-server-test";
const station = ObjectId('641b3a94f742dd9ea6d0416b');



function createAllDetections() {
  let required = {
    "63ee6fee7df27e1bcc412e92": {
      "label": "Furo",
      "class": "63ee6fee7df27e1bcc412e92",
      "color": "#4caf50",
      "qtt": Math.floor(Math.random() * 100)
    },
    "63ee6ffb1d41c5e397e7be3a": {
      "label": "Selo",
      "class": "63ee6ffb1d41c5e397e7be3a",
      "color": "#03a9f4",
      "qtt": Math.floor(Math.random() * 100)
    },
    "63ee7000d7d5e39da4c34677": {
      "label": "Bujão",
      "class": "63ee7000d7d5e39da4c34677",
      "color": "#ff9800",
      "qtt": Math.floor(Math.random() * 100)
    },
    "63ff589609373d6f83dd652f": {
      "label": "Pino",
      "class": "63ff589609373d6f83dd652f",
      "color": "#df4fc3",
      "qtt": Math.floor(Math.random() * 100)
    },
    "63ffa8176856a4a737d88e6b": {
      "label": "Alívio",
      "class": "63ffa8176856a4a737d88e6b",
      "color": "#ffeb3b",
      "qtt": Math.floor(Math.random() * 100)
    }
  }
  let all_detections = [];
  let ok = true;

  Object.entries(required).forEach(([key, value]) => {
    let count = randomIntFromInterval(0, value.qtt);
    if (count < value.qtt) { ok = false; };
    for (let i = 0; i < count; i++) {
      let x_min = Math.random();
      let x_max = Math.random();
      let y_min = Math.random();
      let y_max = Math.random();
      all_detections.push({
        "bbox_normalized": {
          x_max,
          x_min,
          y_max,
          y_min
        },
        "class": key,
        "color": value.color,
        "confidence": Math.random(),
        "id": String(new ObjectId()),
        "label": value.label
      })
    }
  })

  return { all_detections, ok, required };
}


let surfaces = [
  // "Face Direita",
  // "Face Esquerda",
  // "Face Carter",
  // "Face Fogo",
  // "Face Frontal",
  "Face Traseira"
]

for (let i = 0; i < surfaces.length; i++) {
  let { all_detections, ok, required } = createAllDetections();
  db.getCollection('inspection_events')
    .insertOne({
      "event_time": new Date(),
      "type": "surface_inspection",
      station,
      "event_data": {
        "info": {
          "window_ini_time": new Date(),
          "window_end_time": new Date(),
          inspection_id,
        },
        "inspection_result": {
          ok
        },
        "scan_data": {
          all_detections,
          hostname,
          "info": {
            "window_end_time": new Date(),
            "window_ini_time": new Date()
          },
          "surface": surfaces[i]
        },
        "part_data": {
          part_id,
          required,
          // surfaces_qtt: surfaces.length
        }
      }
    })
}


