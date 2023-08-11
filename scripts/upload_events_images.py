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
dict_class = {
    "625e7de957817d0019676c17": {
        "VIN Tag": "625e7dd53c47cbae3033f32b",
        "Sedan": "62608bed59e0d7a9357a93f5",
        "Fadil": "62608c7d96a7bf4a5fab9ca9",
        "VFe34": "62608c8491312211dd910ff9",
        "VF8": "62608c8d860439010c1fbd1e",
        "VF9": "62ecda6654eb7d9e3d09cc32",
        "VF5": "63e5a4a8117e0f491de5a009",
        "VF6": "63e5a4cbddae94c620f62dca"
    },
    "625e7e3457817d0019676c1c": {
        "Panel Sun Roof": "625e7e21301c719a238aef54"
    },
    "625e7ec157817d0019676c21": {
        "Headlights": "625e7eb6b58c2dd3f95097a8",
        "Wheel": "62608da39d9222d9ee99f206",
        "Fog Light": "62608db8ff73927f5e9cffd4",
        "Front Side Maker": "62895e7680e5ae635f46291f",
        "Numberplate": "62895f86973767bab33f1558"
    },
    "625e7f2a57817d0019676c28": {
        "Headlights": "625e7f1d69e8647d036108b5"
    },
    "625e7fa857817d0019676c2d": {
        "Logo": "62608e3f9dcb1e1fb22968ee",
        "Rear Lamp": "62608e4668c0af7d25163deb",
        "Wheel": "62729e9589c62a23777ad157",
        "Rear Fog Lamp": "629a21a5730ac5e0a7f69e01"
    },
    "625e801e57817d0019676c32": {
        "Headlights": "625e8016d8a7c7a81ebf3234"
    },
    "6260f1ba57817d001967741b": {
        "VFe34": "62aba41eaa3b0e191f550c66",
        "VF8": "62aba630237b25279d59a02c",
        "VF5": "63e5ab82b9b997c1974c12b9"
    },
    "6260f1dd57817d001967741e": {
        "Side Light Function": "62608f674d2c3ad02d777167",
        "No Side Light Function": "629a2a8a3f181b82f242b611",
        "VFe-34": "62a38e5ccd44432bf82afbbf"
    },
    "6260f20b57817d0019677421": {
        "VF8 20 inch Plus": "62608f90ffab777047ddad9f",
        "VF8 19 inch Smart": "629a2c717494124a0d77e3a5",
        "VFe-34": "62a38296911e9520244157e4",
        "VF9 Eco": "6401090ea43c43532c3f2dcd",
        "VF9 Plus": "6401092230867ade5811afa2"
    },
    "6260f23157817d0019677424": {
        "sedan_1": "62608fbbe0b0db3ea5344204"
    },
    "6260f26e1200ed001d049904": {
        "sedan_A": "62608ff156678c06b8d2b79e"
    },
    "627c1e5cedf5da001a60cc9f": {
        "0": "0",
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "A": "A",
        "B": "B",
        "C": "C",
        "D": "D",
        "E": "E",
        "F": "F",
        "G": "G",
        "H": "H",
        "I": "I",
        "J": "J",
        "K": "K",
        "L": "L",
        "M": "M",
        "N": "N",
        "O": "O",
        "P": "P",
        "Q": "Q",
        "R": "R",
        "S": "S",
        "T": "T",
        "U": "U",
        "V": "V",
        "W": "W",
        "X": "X",
        "Y": "Y",
        "Z": "Z"
    },
    "62895188524aea001a727862": {
        "WHA": "6289511a276ef3658ac864ff",
        "BKA": "6289512c8fcddf71c7c6c181",
        "BLU": "6289512f82ab540c852236c2",
        "ORB": "62895131aabb0ab3978ebeea",
        "REC": "628ff8a3b41e2fbdc3e1a9bd",
        "GYA": "62a9e8f68620576577242f75",
        "GNB": "62a9e90fb593bdd30045c393",
        "SIA": "62a9e9186fdfb3075b465143"
    },
    "62895867524aea001a7278d6": {
        "License Plate": "628957d9416a48b8bae83302",
        "Front Side Maker": "628957fad03e14de06c2d1fe",
        "Wheel": "6289585e6fbac653588a8681"
    },
    "62895921524aea001a7278da": {
        "Long": "6289590bea5943be5fd72d71",
        "Short": "6289590dfdbabbabaf4299d7",
        "VFe-34": "6349510452ff01b64124e9bf"
    },
    "6297e1ad72ba27001af8a5f8": {
        "teste": "6297e1a5bd9d90dd4fe49f02"
    },
    "629a28ee72ba27001af8b3c8": {
        "Reflector": "629a28444d1bdf12adf8f211",
        "Builtin Light": "62e439800afe3d973af21087"
    },
    "629a29d372ba27001af8b3cb": {
        "VN ECO": "629a298ade5c0f2ace29a1db",
        "VN PLUS": "629a299425943993a7d85885",
        "US ECO": "629a299e4881c8e4e71bca23",
        "US PLUS": "629a29ae95552f879632d527",
        "VFe34": "62e43a727a924748cc2e22ec",
        "US_CA_ECO": "62e43d29111296d213aeed69",
        "US_CA_PLUS": "62e43d519d855e705d08b9b7"
    },
    "629a2e61fa4fd9001b30e572": {
        "Panel Sun Roof": "629a2e0b04cc7b4835053aa1",
        "No Panel Sun Roof": "629a2e2df0f3eb4bb8521d30"
    },
    "62ab2e74fa4fd9001b311b1d": {
        "Scratch": "618c4296d4cef234d5a8b608",
        "Ding/Dirt": "618c429d9ca794899dd69627",
        "Dent": "618c42a455133a2b4e438f1f",
        "Orange Peel": "62eb1a59db2ccb31a53364a0",
        "Chip": "63ac4144bcc046530fba74ce"
    }
}

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

def get_comps(comp_json):
    comp_list = []
    for comp_key in comp_json.keys():
            if comp_key.startswith("component_"):
                comp_list.append(comp_key)
    return comp_list
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
    max_examples=400
    for dataset in dataset_list:
        if dataset["type"] == "debug":
            if not edge_client.upload_extract(
                    app_token,
                    dataset["dataset"],
                    extract_folder="/opt/eyeflow/data/extract_debug",
                    max_files=max_examples,
                    thumb_size=128
                ):
                log.error(f'Fail uploading extract {dataset["dataset"]}')
        elif dataset["type"] == "feedback":
            if not edge_client.upload_feedback(
                    app_token,
                    dataset["dataset"],
                    feedback_folder="/opt/eyeflow/data/extract_ihm",
                    thumb_size=128
                ):
                log.error(f'Fail uploading feedback {dataset["dataset"]}')
        elif dataset["type"] == "surface":
            if not edge_client.upload_feedback(
                    app_token,
                    dataset["dataset"],
                    feedback_folder="/opt/eyeflow/data/extract_surface",
                    thumb_size=128
                ):
                log.error(f'Fail uploading feedback surface{dataset["dataset"]}')
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def get_events():
    client_dst = MongoClient("mongodb://silicon:vinfast@192.168.2.2:27017/?authSource=admin&readPreference=primary&directConnection=true&ssl=false")
    db_dst = client_dst["eyeflow"]
    cursor = db_dst.events_to_upload.find({"uploaded": {"$ne": True}})
    events = []
    if cursor is not None:
        for evt in cursor:
            events.append(evt)
    else:
        log.info(f"No exists extracts")
        exit(0)
    return events
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def update_events(events_ids):
    client_dst = MongoClient("mongodb://silicon:vinfast@192.168.2.2:27017/?authSource=admin&readPreference=primary&directConnection=true&ssl=false")
    db_dst = client_dst["eyeflow"]
    db_dst.events_to_upload.update_many({"_id": {"$in": events_ids}}, {"$set": {"uploaded": True} })

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

def get_examples(frame_data):
    res=[]
    for comp_key in get_comps(frame_data):
        instances = []
        comp = frame_data[comp_key]
        comp_dataset_id= comp["dataset_id"]
        dets = [comp["outputs"][out] for out in comp["outputs"] if comp["outputs"][out]]
        for detections in dets:
            for detection in detections:
                aux = copy.deepcopy(detection)
                instance = {
                            "class": aux.get("class"),
                            "label": aux.get("label"),
                            "bbox":  {
                                         "x_min": aux.get("bbox").get("x_min") * frame_data.get("event_scale"),
                                         "y_min": aux.get("bbox").get("y_min") * frame_data.get("event_scale"),
                                         "x_max": aux.get("bbox").get("x_max") * frame_data.get("event_scale"),
                                         "y_max": aux.get("bbox").get("y_max") * frame_data.get("event_scale")
                                     }
                            }
                for sub_comp_key in get_comps(detection):
                    del aux[sub_comp_key]
                    sub_comp = detection[sub_comp_key]
                    example = sub_comp.get("outputs",{})
                    if example and sub_comp.get("dataset_id"):
                        example["dataset_id"] = sub_comp["dataset_id"]
                        example["bbox"] = detection["bbox"]
                        example["_id"] = ObjectId()
                        res.append(example)
                instances.append(instance)
        res.append({"dataset_id": comp_dataset_id, "instances": instances, "_id": ObjectId()})    
    return res
#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

def get_example(region):
    res=[]
    
    if not region.get("classification",{}).get("dataset_id",None):
        return res
    example = {}
    example["_id"] = ObjectId()
    example["dataset_id"]  = region.get("classification",{}).get("dataset_id",None)
    example["class"]  = region.get("classification",{}).get("class",None)
    example["label"]  = region.get("classification",{}).get("label",None)
    example["image_file"] = region.get("image_file",None)
    example["image_path"] = region.get("image_path",None)
    example["image_scale"] = region.get("image_scale",None)
    example["bbox"] = region.get("bbox",None)

    if region.get("classification",{}).get("falseNokUser",None):
        example["feedback_user"] = region.get("classification",{}).get("falseNokUser",None)

    res.append(example)
    return res
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

def main():
    events = get_events()
    dataset_list=[]
    if not events:
        log.info("no example to upload")
        return
    
    for evt in events:
        if evt.get("original_collection") == "events":
            scale = evt.get("frame_data", {}).get("event_scale", 1)
            v_type = "debug"
            aux = {
                    "image_file": evt.get("image_file", None),
                    "image_path": evt.get("image_path", None),
                    "image_scale": scale
            }
            examples = get_examples(evt.get("frame_data",{}))
        elif evt.get("original_collection") == "repair_events":
            scale = evt.get("region", {}).get("image_scale", 1)
            v_type = "feedback"
            aux = {
                    "image_file": evt.get("region", {}).get("image_file", None),
                    "image_path": evt.get("region", {}).get("image_path", None),
                    "image_scale": scale
            }
            examples = get_example(evt.get("region",{}))
        
        elif evt.get("original_collection") == "surface":
            v_type = "surface"
            aux = {
                    "image_file": evt.get("image_file", None),
                    "image_path": evt.get("image_path", None),
                    "original_id": str(evt.get("original_id", None)),
                    "dataset": evt.get("dataset", None)
            }
            copy_example(aux)
            if evt.get("dataset", None) not in [dtset["dataset"] for dtset in dataset_list]:
                dataset_list.append({"dataset": evt.get("dataset", None),  "type": "surface"})
            continue

        else:
            continue

        image = get_image(aux, v_type)
        if image.any():
            for example in examples:
                if v_type == "debug":
                    extract_path = "/opt/eyeflow/data/extract_debug"
                elif v_type == "feedback":
                    extract_path = "/opt/eyeflow/data/extract_ihm"
                elif v_type == "surface":
                    extract_path = "/opt/eyeflow/data/extract_surface"
                else:
                    return None

                bbox = example.get("bbox",None)
                
                if bbox:
                    img = image[int(bbox['y_min']*scale):int(bbox['y_max']*scale), int(bbox['x_min']*scale):int(bbox['x_max']*scale)]
                    height, width, channels = img.shape
                    img_data={}
                    img_data["_id"] = example["_id"]
                    img_data["example"] = f'{example["_id"]}.jpg'
                    img_data["example_thumb"] = f"{example['_id']}_thumb.jpg"
                    img_data["dataset_id"] = example["dataset_id"]
                    img_data["date"] = datetime.datetime.now(datetime.timezone.utc).isoformat()#.strftime("%Y-%m-%d %H:%M:%S")
                    #img_data["frame_time"] = datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%S")
                    img_data["img_height"] = height
                    img_data["img_width"] = width
                    if not example.get("class"):
                        img_data["annotations"] = {"class": dict_class.get(example["dataset_id"],{}).get(example.get("label"))}
                    else:
                        img_data["annotations"] = {"class": example.get("class")}
                    img_data["feedback"]={}
                    if example.get("feedback_user",None):
                        img_data["feedback"]["feedback_user"] = example["feedback_user"]

                else:
                    img = image
                    height, width, channels = img.shape
                    img_data={}
                    img_data["_id"] = example["_id"]
                    img_data["date"] = datetime.datetime.now(datetime.timezone.utc).isoformat()#.strftime("%Y-%m-%d %H:%M:%S")
                    #img_data["frame_time"] = datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%S")
                    img_data["img_height"] = height
                    img_data["img_width"] = width
                    img_data["annotations"] = {"instances": example["instances"]}

                if not os.path.isdir(os.path.join(extract_path, example["dataset_id"])):
                    os.mkdir(os.path.join(extract_path, example["dataset_id"]))

                with open(os.path.join(extract_path, example["dataset_id"], str(example["_id"]) + '_data.json'), 'w', newline='', encoding='utf8') as fp:
                    json.dump(img_data, fp, ensure_ascii=False, indent=2, default=str)

                cv2.imwrite(os.path.join(extract_path, example["dataset_id"], str(example["_id"]) +'.jpg'),img)

                if example["dataset_id"] not in [dtset["dataset"] for dtset in dataset_list]:
                    dataset_list.append({"dataset": example["dataset_id"], "type":v_type})
    upload_files(dataset_list)
    update_events([evt["_id"] for evt in events])
    clear_extract(dataset_list)


#--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

if __name__ == '__main__':
    while True:
        main()
        time.sleep(30)

