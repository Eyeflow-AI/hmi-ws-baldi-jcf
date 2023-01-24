import jwt from 'jsonwebtoken';
import fs from 'fs';

const publicKey = fs.readFileSync(process.env.JWT_PRIVATE_KEY_FILE);

function verifyToken(token) {
    try {
        let decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        return [null, decoded];
    }
    catch (err) {
        return [err, null];
    }
};

export default verifyToken;