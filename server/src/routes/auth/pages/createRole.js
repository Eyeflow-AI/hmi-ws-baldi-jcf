import Mongo from "../../../components/mongo";
import getAccessControlDocument from '../utils/getAccessControlDocument';
// import getUserRole from '../utils/getUserRole';
import stringToSHA256 from "../../../utils/stringToSHA256";
import checkUsernameList from "../utils/checkUsernameList";
import getMissingKeysFromObject from "../../../utils/getMissingKeysFromObject";

const requiredKeys = [
    'roleName',
    'description',
    'types',
];


async function creteRole(req, res, next) {

    try {
        let body = req.body;
        let missingKeys = getMissingKeysFromObject(body, requiredKeys);

        if (missingKeys.length === 0) {
            let accessControlDocument = await getAccessControlDocument();
            let validTypes = Object.keys(accessControlDocument?.types ?? {}) ?? [];
            let typesValidated = body?.types.every((el) => validTypes.includes(el));
            let roleAlreadyExist = Object.keys(accessControlDocument?.roles ?? {}).includes(body.roleName);

            if (typesValidated && !roleAlreadyExist) {
                let newRole = {
                    description: body.description,
                    types: body.types,
                    deletable: true,
                    editable: true,
                };
                let updated = await Mongo.db.collection('params').updateOne(
                    { name: 'accessControl' },
                    { $set: { [`roles.${body.roleName.replaceAll(/\./g, '')}`]: newRole } }
                );
                if (updated.modifiedCount === 0) {
                    res.status(400).json({ ok: false, msg: 'The role was not created' });
                }
                else {
                    let accessControlDocument = await getAccessControlDocument();
                    res.status(201).json({ ok: true, msg: `The role ${body.roleName} was created`, accessControlDocument });

                }
            }

        }
        else {
            let err = new Error(`The following keys are missing from the request body: ${missingKeys.join(', ')}`);
            err.status = 400;
            next(err);
        };
    }
    catch (err) {
        next(err);
    };
};

export default creteRole;