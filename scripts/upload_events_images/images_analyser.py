import os
import json
import copy
import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId
import cv2
from eyeflow_sdk.log_obj import log, CONFIG
from eyeflow_sdk.file_access import FileAccess
from eyeflow_sdk import edge_client
import jwt
import shutil
import pathlib
import time
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def json_read(json_path, json_file):
    if not os.path.isfile(os.path.join(json_path, json_file)):
        raise Exception(f"json_file not found: {json_file}")
    with open(os.path.join(json_path, json_file), "r") as jsonfile:
        return json.loads(jsonfile.read())
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def save_json_file(data, json_path):
    print(f'save Json: {json_path}')
    with open(json_path, 'w', encoding='utf8') as json_file:
        return json.dump(data, json_file, ensure_ascii=False)
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def get_subclass(det, comps):
    subclass_list = []
    for comp in comps:
        subclass_list.append([det[comp]["outputs"]["class"] for out in det[comp]["outputs"] if det[comp]["outputs"]].pop())
    return subclass_list
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def clear_extract(dataset_list):

    for dataset in dataset_list:
        if dataset["type"] == "debug":
            extract_path = "/opt/eyeflow/data/extract_debug"
        elif dataset["type"] == "feedback":
            extract_path = "/opt/eyeflow/data/extract_ihm"
        elif dataset["type"] == "surface":
            extract_path = "/opt/eyeflow/data/extract_surface"
        else:
            continue
    
        if os.path.isdir(os.path.join(extract_path, dataset["dataset"])):
            for filename in os.listdir(os.path.join(extract_path, dataset["dataset"])):
                try:
                    os.remove(os.path.join(extract_path, dataset["dataset"], filename))
                except:
                    pass
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def get_license(filename="edge.license"):
    # read app_token
    license_file = os.path.join("/opt/eyeflow/src", filename)
    if not os.path.isfile(license_file):
        log.error(f'Error: license_file not found {license_file}')
        raise Exception(f'Error: license_file not found {license_file}')

    with open(license_file, 'r') as fp:
        app_token = fp.read()

    key_file = os.path.join("/opt/eyeflow/src", "edge-key.pub")
    if not os.path.isfile(key_file):
        log.error(f'Error: token pub key not found {key_file}')
        raise Exception(f'Error: token pub key not found {key_file}')

    with open(key_file) as fp:
        public_key = fp.read()

    app_info = jwt.decode(app_token, public_key, algorithms=['RS256'])
    return app_info, app_token
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def upload_files(dataset_list):
    app_info, app_token = get_license()
    print(app_info)
    max_examples=400
    for dataset in dataset_list:
        # if dataset["type"] == "debug":
        #     if not edge_client.upload_extract(
        #             app_token,
        #             dataset["dataset"],
        #             extract_folder="/opt/eyeflow/data/extract_debug",
        #             max_files=max_examples,
        #             thumb_size=128
        #         ):
        #         log.error(f'Fail uploading extract {dataset["dataset"]}')
        # elif dataset["type"] == "feedback":
        edge_client.upload_feedback(
                app_token,
                dataset,
                feedback_folder="/opt/eyeflow/data/extract_ihm",
                thumb_size=128
        )
            # log.error(f'Fail uploading feedback {dataset["dataset"]}')
        # elif dataset["type"] == "surface":
        #     if not edge_client.upload_feedback(
        #             app_token,
        #             dataset["dataset"],
        #             feedback_folder="/opt/eyeflow/data/extract_surface",
        #             thumb_size=128
        #         ):
        #         log.error(f'Fail uploading feedback surface{dataset["dataset"]}')
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def get_events(mongo_url, mongo_db, mongo_collection):
    client_dst = MongoClient(mongo_url)
    db_dst = client_dst[mongo_db]
    cursor = db_dst[mongo_collection].find({"uploaded": {"$ne": True}, "original_collection": "inspection_events"}).limit(100)
    events = []
    if cursor is not None:
        for evt in cursor:
            events.append(evt)
    else:
        log.info(f"No exists extracts")
        exit(0)
    return events
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def update_events(mongo_url, mongo_db, mongo_collection, events):
    client_dst = MongoClient(mongo_url) 
    db_dst = client_dst[mongo_db]
    db_dst[mongo_collection].update_many({"_id": {"$in": events}}, {"$set": {"uploaded": True} })

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def get_image(image,v_type):
    if v_type == "debug":
        path = os.path.join("/mnt/edge_server_1", image.get("image_path"), image.get("image_file"))
        if not os.path.isfile(path):
            log.error(f"image not found: {path}")
            return None
        img = cv2.imread(path, cv2.IMREAD_COLOR)
    else:
        path = os.path.join("/opt/eyeflow/data/event_image", image.get("image_path"), image.get("image_file"))
        if not os.path.isfile(path):
            log.error(f"image not found: {path}")
            return None
        img = cv2.imread(path, cv2.IMREAD_COLOR)

    return img
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def get_event_info(data, image):
    info = {
        "face" : {},
        "elements" : {},
        "datasets": [],
        "cropped_image": ""
    }
    height, width = image.shape[:2]

    # FACE
    info["face"]["image_id"] = str(ObjectId())
    info["face"]["_id"] = ObjectId(info["face"]["image_id"])
    info["face"]["example"] = f'{info["face"]["image_id"]}.jpg'
    info["face"]["example_thumb"] = f'{info["face"]["image_id"]}_thumb.jpg'
    info["face"]["date"] = datetime.datetime.now(datetime.timezone.utc).isoformat()#.strftime("%Y-%m-%d %H:%M:%S")
    info["face"]["dataset_id"] = ObjectId(data["region_dataset_id"])
    info["face"]["dataset_name"] = ""
    info["face"]["img_height"] = height
    info["face"]["img_width"] = width
    info["face"]["annotations"] = {
        "instances": [
            {
                "bbox": data["bbox"],
                "class": data["region_id"],
                "type": "automatic",
                "regionType": "bbox"
            }
        ]
    }
    info["face"]["feedback"] = {}
    info["datasets"].append(data["region_dataset_id"])

    # ELEMENTS
    cropped_image = image[
        data["bbox"]['y_min']:data["bbox"]['y_max'], 
        data["bbox"]['x_min']:data["bbox"]['x_max']
        ]
    info["cropped_image"] = cropped_image
    _height, _width = cropped_image.shape[:2]
    info["elements"]["date"] = datetime.datetime.now(datetime.timezone.utc).isoformat()#.strftime("%Y-%m-%d %H:%M:%S")
    info["elements"]["image_id"] = str(ObjectId())
    info["elements"]["example"] = f'{info["elements"]["image_id"]}.jpg'
    info["elements"]["_id"] = ObjectId(info["elements"]["image_id"])
    info["elements"]["example_thumb"] = f'{info["elements"]["image_id"]}_thumb.jpg'
    info["elements"]["dataset_name"] = ""
    info["elements"]["img_height"] = _height
    info["elements"]["img_width"] = _width
    info["elements"]["annotations"] = {"instances": []}  
    for test in data["tests"]:
        for detection in test["detections"]:
            detection["bbox"]["x_min"] = detection["bbox"]["x_min"] - data["bbox"]["x_min"]
            detection["bbox"]["x_max"] = detection["bbox"]["x_max"] - data["bbox"]["x_min"]
            detection["bbox"]["y_min"] = detection["bbox"]["y_min"] - data["bbox"]["y_min"]
            detection["bbox"]["y_max"] = detection["bbox"]["y_max"] - data["bbox"]["y_min"]
            info["elements"]["annotations"]["instances"].append({
                "bbox": detection["bbox"],
                "type": "automatic",
                "regionType": "bbox",
                "class": detection["item_id"]
            })
            info["datasets"].append(detection["item_dataset_id"])
            info["elements"]["dataset_id"] = ObjectId(detection["item_dataset_id"])
    info["elements"]["feedback"] = {}


    if len(data["detections"]) > 0:
        for detection in data["detections"]:
            info["elements"]["annotations"]["instances"].append({
                "bbox": detection["bbox"],
                "type": "automatic",
                "regionType": "bbox",
                "class": detection["item_id"]
            })
            print(detection)
            info["datasets"].append(detection["item_dataset_id"])

    info["datasets"] = list(set(info["datasets"]))
    # print(info)


    return info
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
def write_files(extract_path, dataset, example, img, info):
    with open(os.path.join(extract_path, dataset, str(example) + '_data.json'), 'w', newline='', encoding='utf8') as fp:
        json.dump(info, fp, ensure_ascii=False, indent=2, default=str)

    cv2.imwrite(os.path.join(extract_path, dataset, str(example) +'.jpg'),img)

    return

#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def copy_example(example):
    path_dst = "/opt/eyeflow/data/extract_surface"
    img_src = os.path.join(example.get("image_path"), example.get("original_id"))
    img_dst = os.path.join(path_dst, example.get("dataset"), example.get("original_id"))
    if os.path.isfile(img_dst):
        log.info(f"img_dst EXISTS IN DESTINY")
        return

    if not os.path.isfile(os.path.join(example.get("image_path"), example.get("image_file"))):
        # raise Exception(f"Event image not found {img_src}")
        log.error(f'Event image not found: {os.path.join(example.get("image_path"), example.get("image_file"))}')
        return

    pathlib.Path(os.path.join(path_dst, example.get("dataset"))).mkdir(parents=True, exist_ok=True)

    for fl in [".jpg","_thumb.jpg", "_data.json"]:
        if fl =="_data.json":
            aux = json_read(example.get("image_path"), example.get("original_id")+fl)
            aux["feedback"]={}
            aux["feedback"]["feedback_user"] = ""
            save_json_file(aux, os.path.join(path_dst, example.get("dataset"), example.get("original_id")+fl))
        else:
            shutil.copy2(img_src+fl, img_dst+fl)
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def main(mongo_url, mongo_db, mongo_collection):
    events = get_events(mongo_url, mongo_db, mongo_collection)
    dataset_list=[]
    if not events:
        log.info("no example to upload")
        return
    for evt in events:
        aux = {}
        event_info = {}
        if evt.get("original_collection") == "inspection_events":
            scale = evt.get("image_scale", 1)
            v_type = "feedback"
            aux = {
                    "image_file": evt.get("image_file", None),
                    "image_path": evt.get("image_path", None),
                    "image_scale": scale
            }
            image = get_image(aux, v_type)  
            event_info = get_event_info(evt.get("data",{}), image)
        # elif evt.get("original_collection") == "repair_events":
        #     scale = evt.get("region", {}).get("image_scale", 1)
        #     v_type = "feedback"
        #     aux = {
        #             "image_file": evt.get("region", {}).get("image_file", None),
        #             "image_path": evt.get("region", {}).get("image_path", None),
        #             "image_scale": scale
        #     }
        #     examples = get_example(evt.get("region",{}))
        
        # elif evt.get("original_collection") == "surface":
        #     v_type = "surface"
        #     aux = {
        #             "image_file": evt.get("image_file", None),
        #             "image_path": evt.get("image_path", None),
        #             "original_id": str(evt.get("original_id", None)),
        #             "dataset": evt.get("dataset", None)
        #     }
        #     copy_example(aux)
        #     if evt.get("dataset", None) not in [dtset["dataset"] for dtset in dataset_list]:
        #         dataset_list.append({"dataset": evt.get("dataset", None),  "type": "surface"})
        #     continue

        else:
            continue

        if v_type == "debug":
            extract_path = "/opt/eyeflow/data/extract_debug"
        elif v_type == "feedback":
            extract_path = "/opt/eyeflow/data/extract_ihm"
        elif v_type == "surface":
            extract_path = "/opt/eyeflow/data/extract_surface"
        else:
            return None
        for _dataset in event_info.get("datasets",[]):
                if not os.path.isdir(os.path.join(extract_path, _dataset)):
                    os.makedirs(os.path.join(extract_path, _dataset))

        if image.any():
            # for place, info  in examples.items():
        

            # TODO write face
            face = event_info.get("face",None)
            if face:
                write_files(extract_path, str(face["dataset_id"]), face["image_id"], image, face)

            # TODO write elements
            elements = event_info.get("elements",None)
            if elements:
                write_files(extract_path, str(elements["dataset_id"]), elements["image_id"], event_info["cropped_image"], elements)
    upload_files(event_info.get("datasets",[]))
    # update_events(mongo_url, mongo_db, mongo_collection, events = [evt["_id"] for evt in events])
    # clear_extract(dataset_list)


#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

if __name__ == '__main__':
    # while True:
        # main()
        # time.sleep(30)
    main(
        mongo_url="mongodb://studies:62e05dd021ccc531bd645b2e@143.244.167.128:27017/?authSource=admin&readPreference=primary&ssl=false", 
        mongo_db="hmi_ws", 
        mongo_collection="events_to_upload"
        )


