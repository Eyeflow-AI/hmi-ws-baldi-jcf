import verifyToken from '../utils/verifyToken';

function extractToken(req) {
    if (req.headers.authorization?.split(' ')?.[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    else if (req?.query?.token) {
        return req.query.token;
    }
    return null;
};

function isAuthenticated(req, res, next) {
    let token = extractToken(req);
    if (token) {
        let [err, tokenPayload] = verifyToken(token);
        if (err) {
            err.status = 400;
            next(err);
        }
        else {
            req.app.auth = Object.assign({}, req.app.auth, { token, tokenPayload });
            next();
        };
    }
    else {
        let err = new Error(`Bearer Token or query token required`);
        err.status = 400;
        next(err);
    };
};

export default isAuthenticated;