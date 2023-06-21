import Mongo from "../../../components/mongo";

// const log = require('../../utils/log');


function getDeleteManyQuery(query, exceptUserId, exceptUserName) {
    let userIdList, usernameList = [[], []];
    let deleteQuery = {};
    let valid = false;
    if (query.userId) {
        let userIdQuery = { _id: { $in: [] } };
        userIdList = Array.isArray(query.userId) ? [...new Set(query.userId)] : [query.userId];
        for (let userId of userIdList) {
            if (Mongo.ObjectId.isValid(userId) && userId !== exceptUserId) {
                userIdQuery._id.$in.push(new Mongo.ObjectId(userId));
            }
        };
        if (userIdQuery._id.$in.length > 0) {
            Object.assign(deleteQuery, userIdQuery);
            valid = true;
        };
    };
    if (query.username) {
        let usernameQuery = { 'auth.username': { $in: [] } };
        usernameList = Array.isArray(query.username) ? [...new Set(query.username)] : [query.username];
        let execeptIndex = usernameList.findIndex(el => el === exceptUserName);
        if (execeptIndex !== -1) {
            usernameList.splice(execeptIndex, 1);
            // log.warning(`User ${exceptUserName} tryed to delete itself`, 'getDeleteManyQuery');
        };
        if (usernameList.length > 0) {
            usernameQuery['auth.username'].$in = usernameList;
            Object.assign(deleteQuery, usernameQuery);
            valid = true;
        };
    };

    return [deleteQuery, valid];
};

async function deleteUser(req, res, next) {

    try {

        let query = { username: req.body.username };
        let userId = req.app.auth.tokenPayload.payload.userid;
        let userUsername = req.app.auth.tokenPayload.payload.username;
        console.log(`Recv query: ${JSON.stringify(query)}`);
        let [deleteQuery, valid] = getDeleteManyQuery(query, userId, userUsername);
        if (valid) {
            console.log(`Deleting users with query: ${JSON.stringify(deleteQuery)}`);
            let deleteResult = await Mongo.db.collection('user').deleteMany(deleteQuery);
            if (deleteResult.deletedCount > 0) {
                res.status(200).json({ ok: true });
            }
            else {
                let err = new Error(`User does not exist.`);
                err.status = 400;
                next(err);
            };
        }
        else {
            let err = new Error(`Invalid query parms. Valid username or userId required`);
            err.status = 400;
            next(err);
        };
    }
    catch (err) {
        next(err);
    };
};

export default deleteUser;