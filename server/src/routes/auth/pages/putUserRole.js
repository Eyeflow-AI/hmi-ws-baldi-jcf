import Mongo from "../../../components/mongo";
import getMissingKeysFromObject from "../../../utils/getMissingKeysFromObject";
import getAccessControlDocument from '../utils/getAccessControlDocument';


const requiredKeys = [
    'username',
    // 'accessControl',
    'newRole',
];

async function putUserRole(req, res, next) {

    try {
        let body = req.body;
        let missingKeys = getMissingKeysFromObject(body, requiredKeys);

        if (missingKeys.length === 0) {
            let userUsername = req.app.auth.tokenPayload.payload.username;
            if (body.username !== userUsername) {
                let userDocument = await Mongo.db.collection('user').findOne({ 'auth.username': body.username });
                let accessControlDocument = await getAccessControlDocument();
                let roleExists = Object.keys(accessControlDocument?.roles ?? {}).includes(body.newRole);

                if (userDocument && roleExists) {
                    let oldRole = userDocument.auth.role ?? '';
                    let result = await Mongo.db.collection('user').updateOne(
                        { _id: userDocument._id },
                        { $set: { 'auth.role': body.newRole } }
                    );

                    if (result.modifiedCount === 1) {
                        res.status(200).json({
                            ok: true,
                            oldUserRole: oldRole,
                            newUserRole: body.newRole,
                        });
                    }
                    else {
                        let err = new Error(`User ${body.username} access control did not change`);
                        err.status = 400;
                        next(err);
                    };
                }
                else {
                    let err = new Error(`User ${body.username} does not exist or role ${body.newRole} does not exist`);
                    err.status = 400;
                    next(err);
                }
            }
            else {
                let err = new Error(`User cannot change their own role`);
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

export default putUserRole;