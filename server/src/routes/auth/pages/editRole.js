import Mongo from "../../../components/mongo";
import getAccessControlDocument from '../utils/getAccessControlDocument';
import getMissingKeysFromObject from "../../../utils/getMissingKeysFromObject";

const requiredKeys = [
    'roleName',
    'description',
    'types',
    'oldRoleName',
];


async function editRole(req, res, next) {

    try {
        let body = req.body;
        let missingKeys = getMissingKeysFromObject(body, requiredKeys);

        if (missingKeys.length === 0) {
            let accessControlDocument = await getAccessControlDocument();
            let validTypes = Object.keys(accessControlDocument?.types ?? {}) ?? [];
            let typesValidated = body?.types.every((el) => validTypes.includes(el));
            let roleExists = Object.keys(accessControlDocument?.roles ?? {}).includes(body.oldRoleName);
            let roleCanBeEdited = accessControlDocument?.roles[body.oldRoleName]?.editable ?? false;

            if (typesValidated && roleExists && roleCanBeEdited) {
                let roleEdited = {
                    description: body.description,
                    types: body.types,
                    deletable: true,
                    editable: true,
                };
                let query = {
                    $set: {
                        [`roles.${body.roleName.replaceAll(/\./g, '')}`]: roleEdited,
                    }
                }
                if (body.roleName !== body.oldRoleName) {
                    query['$unset'] = {
                        [`roles.${body.oldRoleName.replaceAll(/\./g, '')}`]: '',
                    }
                }
                let updated = await Mongo.db.collection('params').updateOne(
                    { name: 'accessControl' },
                    query
                );
                if (updated.modifiedCount === 0) {
                    res.status(400).json({ ok: false, msg: 'The role was not edited' });
                }
                else {
                    let accessControlDocument = await getAccessControlDocument();
                    res.status(201).json({ ok: true, msg: `The role ${body.roleName} was updated`, accessControlDocument });
                }
            }
            else {
                let err = new Error(`The role ${body.roleName} does not exist or cannot be edited. It cannot be edited`);
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

export default editRole;