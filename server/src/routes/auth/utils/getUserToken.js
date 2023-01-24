import jwt from 'jsonwebtoken';
import fs from 'fs';
import Mongo from '../../../components/mongo';


const privateKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILE);

function getUsertToken(userDocument) {

    try {
        let userid = String(userDocument._id);
        let username = userDocument.auth.username;
        let accessControl = userDocument.auth.accessControl;
        let payload = { userid, username, accessControl, profile: userDocument.profile };
        let token = jwt.sign(
            {
                _id: Mongo.ObjectId(),
                payload,
                exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
            },
            privateKey,
            { algorithm: 'RS256' }
        );
        return [null, token];
    }
    catch (err) {
        return [err, null];
    }
};

export default getUsertToken;