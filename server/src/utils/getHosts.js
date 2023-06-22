import getFeConfig from "./getFeConfig";


async function getHosts() {

  let feConfig = await getFeConfig();
  return feConfig.hosts;
};

export default getHosts;