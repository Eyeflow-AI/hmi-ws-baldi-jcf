import getPartsDocument from "./getPartsDocument";

async function getPartData(partId) {

    let partsDocument = await getPartsDocument();
    let partData = partsDocument.parts_list.find(part => part.part_id === partId);
    if (!partData) {
        let err = new Error(`Part with id ${partId} not found in parts_register document`);
        err.status = 400;
        throw err;
    }

    if (partsDocument.color_profiles.hasOwnProperty(partData.color_profile)) {
        partData.color_profile = partsDocument.color_profiles[partData.color_profile];
    }
    else {
        let err = new Error(`Part with id ${partId} has invalid color_profile ${partData.color_profile}`);
        err.status = 400;
        throw err;
    }

    return partData;
};

export default getPartData;