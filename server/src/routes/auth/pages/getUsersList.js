import Mongo from "../../../components/mongo";
import getAccessControlDocument from '../utils/getAccessControlDocument';
import getUserRole from '../utils/getUserRole';


async function getUsersList(req, res, next) {

    try {
        let project = {
            'auth.username': true, 'auth.accessControl': true,
            profile: true, creationDate: true
        };

        let promises = [
            Mongo.db.collection('user').find({}).project(project).toArray(),
            getAccessControlDocument()
        ];

        Promise.all(promises)
            .then(([userDocuments, accessControlData]) => {
                let userList = userDocuments.map((userDocument) => {
                    userDocument.auth.role = getUserRole(accessControlData, userDocument.auth.accessControl);

                    return userDocument;
                });

                res.status(200).json({ userList });
            })
            .catch(next);
    }
    catch (err) {
        next(err);
    };
};

export default getUsersList;