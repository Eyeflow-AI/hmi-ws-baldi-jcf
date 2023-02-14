import os
import requests
from eyeflow_sdk.log_obj import CONFIG, log
import jwt
import json

def get_license(filename="edge.license", filepath="/opt/eyeflow/src"):
    # read app_token
    license_file = os.path.join(filepath, filename)
    if not os.path.isfile(license_file):
        log.error(f'Error: license_file not found {license_file}')
        raise Exception(f'Error: license_file not found {license_file}')

    with open(license_file, 'r') as fp:
        app_token = fp.read()

    app_info = jwt.decode(app_token, options={"verify_signature": False})
    return app_info, app_token


def get_package_data(app_token, package_id):
    try:
        log.info(f"Get package {package_id}")

        endpoint = jwt.decode(app_token, options={"verify_signature": False})['endpoint']
        msg_headers = {'Authorization' : f'Bearer {app_token}'}
        response = requests.get(f"{endpoint}/package/{package_id}", headers=msg_headers)

        if response.status_code != 200:
            log.error(f"Failing get package: {response.json()}")
            return None

        package = response.json()
        if package:
            return package
        else:
            log.warning(f"Failing get package: {response.json()}")
            return None

    except requests.ConnectionError as error:
        log.error(f'Failing get package_id: {package_id}. Connection error: {error}')
        return None
    except requests.Timeout as error:
        log.error(f'Failing get package_id: {package_id}. Timeout: {error}')
        return None
    except Exception as excp:
        log.error(f'Failing get package_id: {package_id} - {excp}')
        return None

def save_package_data(package_data, package_id, file_path='/opt/eyeflow/data/package_data'):
  isExist = os.path.exists(file_path)
  
  if not isExist:
    os.makedirs(file_path)
  
  json_object = json.dumps(package_data, indent=4)
  with open(os.path.join(file_path, f'{package_id}.json'), "w") as outfile:
    outfile.write(json_object)

# -------------------------

app_info, app_token = get_license()
package_id = '625e3c52157a3e001df54b19'
package = get_package_data(app_token, package_id)
save_package_data(package, package_id)