import Mongo from "../../../components/mongo";
import stringToSHA256 from "../../../utils/stringToSHA256";
import checkUsernameList from "../utils/checkUsernameList";
import getMissingKeysFromObject from "../../../utils/getMissingKeysFromObject";

const requiredKeys = [
    'username',
];

const defaultRole = "operator";

async function createUser(req, res, next) {

    try {
        let body = req.body;
        let missingKeys = getMissingKeysFromObject(body, requiredKeys);

        if (missingKeys.length === 0) {
            let [validUsernameList, invalidUsernameList, userThatAlreadyExistList] = await checkUsernameList(body.username);
            console.log(validUsernameList, invalidUsernameList, userThatAlreadyExistList);
            let creationDate = new Date();
            if (validUsernameList.length > 0) {
                let data = validUsernameList.map((username) => {
                    let password = (body.password && body.username === username) ? stringToSHA256(body.password) : null;
                    return {
                        auth: {
                            username,
                            password,
                            role: defaultRole
                        },
                        profile: { name: '', initials: username.slice(0, 2).toUpperCase() },
                        creationDate,
                    };
                });

                let result = await Mongo.db.collection('user').insertMany(data);
                let insertedIds = Object.keys(result?.insertedIds ?? {}).map(key => result.insertedIds[key]);
                let insertedDocuments = await Mongo.db.collection('user').find({ _id: { $in: insertedIds } }).toArray();
                let insertedUsernameList = insertedDocuments.map(({ auth }) => auth.username);
                if (insertedUsernameList.length > 0) {
                    res.status(201).json({ ok: true, insertedUsernameList, invalidUsernameList, userThatAlreadyExistList });
                }
                else {
                    let err = new Error(`Failed to insert user: ${JSON.stringify(body.username)}`);
                    next(err);
                };
            }
            else {
                let err = new Error(`0 users were inserted.`);
                err.status = 400;
                err.extraData = { invalidUsernameList, userThatAlreadyExistList };
                next(err);
            };
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

export default createUser;