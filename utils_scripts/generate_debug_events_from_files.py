import os
from pymongo import MongoClient
import datetime

client = MongoClient("")
db = client["gktb"]

images_analyzer_dir = "/opt/eyeflow/data/framework-tools/images-analyzer"

date_dir_list = [os.path.join(images_analyzer_dir, d) for d in os.listdir(images_analyzer_dir) if os.path.isdir(os.path.join(images_analyzer_dir, d))]

db["debug_events"].delete_many({})

count = 0
for date_dir in os.listdir(images_analyzer_dir):
    date_dir_path = os.path.join(images_analyzer_dir, date_dir)
    if not os.path.isdir(date_dir_path):
        print(f"Skipping {date_dir_path}")


    for inspection_dir in os.listdir(date_dir_path):
        inspection_dir_path = os.path.join(date_dir_path, inspection_dir)
        if not os.path.isdir(inspection_dir_path):
            print(f"Skipping {inspection_dir_path}")

        for file in os.listdir(inspection_dir_path):
            if file.endswith(".json"):
                float_date = os.path.getmtime(os.path.join(inspection_dir_path, file))
                date = datetime.datetime.fromtimestamp(float_date)
                event = {
                    "inspection_id": inspection_dir,
                    "inspection_date": "20231003",
                    "image_file": file.replace(".json", ".jpg"),
                    "json_file": file,
                    "region": file.split("_")[0],
                    "frame_time": date,
                    "uploaded": False,
                    "host": "::ffff:192.168.2.40"
                }
                result = db["debug_events"].insert_one(event)
                if result.acknowledged:
                    count += 1
                    print(f"Inserted {count} events so far")
    