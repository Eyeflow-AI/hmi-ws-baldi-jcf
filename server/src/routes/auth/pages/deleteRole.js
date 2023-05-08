import Mongo from "../../../components/mongo";
import getAccessControlDocument from '../utils/getAccessControlDocument';
import getMissingKeysFromObject from "../../../utils/getMissingKeysFromObject";

const requiredKeys = [
    'roleName'
];


async function deleteRole(req, res, next) {

    try {
        let body = req.body;
        let missingKeys = getMissingKeysFromObject(body, requiredKeys);

        if (missingKeys.length === 0) {
            let accessControlDocument = await getAccessControlDocument();
            let roleExists = Object.keys(accessControlDocument?.roles ?? {}).includes(body.roleName);
            let roleCanBeDeleted = accessControlDocument?.roles[body.roleName]?.editable ?? false;

            if (roleExists && roleCanBeDeleted) {
                let query = {
                    '$unset': {
                        [`roles.${body.roleName.replaceAll(/\./g, '')}`]: '',
                    }
                }
                let updated = await Mongo.db.collection('params').updateOne(
                    { name: 'accessControl' },
                    query
                );
                if (updated.modifiedCount === 0) {
                    res.status(400).json({ ok: false, msg: 'The role was not deleted' });
                }
                else {
                    let accessControlDocument = await getAccessControlDocument();
                    res.status(201).json({ ok: true, msg: `The role ${body.roleName} was deleted`, accessControlDocument });
                }
            }
            else {
                let err = new Error(`The role ${body.roleName} does not exist or cannot be deleted. It cannot be deleted`);
                err.status = 400;
                next(err);
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

export default deleteRole;