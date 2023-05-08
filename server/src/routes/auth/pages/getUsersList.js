import Mongo from "../../../components/mongo";
import getAccessControlDocument from '../utils/getAccessControlDocument';
import getUserControlData from '../utils/getUserControlData';


async function getUsersList(req, res, next) {

    try {
        let project = {
            'auth.username': true, 'auth.role': true,
            profile: true, creationDate: true
        };

        let promises = [
            Mongo.db.collection('user').find({}).project(project).toArray(),
            getAccessControlDocument()
        ];

        Promise.all(promises)
            .then(([userDocuments, accessControlData]) => {
                let userList = userDocuments.map((userDocument) => {
                    userDocument.auth.accessControl = getUserControlData(accessControlData, userDocument.auth.role);

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