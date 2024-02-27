import { execSync } from "child_process";

const container = execSync('docker run --rm siliconlife/hmi-fe-framework cat /usr/share/nginx/html/asset-manifest.json').toString().trim();
const containerEntrys = JSON.parse(container).entrypoints
const containerInfoIndex = containerEntrys.findIndex(entry => entry.includes('static/js'));
const ContainerJSVersion = containerEntrys[containerInfoIndex].replace('static/js/', '').replace('.js', '');


async function getVersion(req, res, next) {
  try {
    console.log({containerEntrys});
    res.status(200).json({
      reload: ContainerJSVersion !== req.query.JSVersion, version: {
        ContainerJSVersion,
        JSVersion: req.query.JSVersion
      }
    });
  }
  catch (err) {
    next(err);
  }
}

export default getVersion;
