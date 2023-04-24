import Mongo from '../../../components/mongo';

function validateUserName(username) {
    var usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
};

function checkUsernameList(input) {

    if (!Array.isArray(input)) {
        input = [input];
    };

    let [usernameList, validUsernameList, invalidUsernameList, userThatAlreadyExistList] = [[], [], [], []];
    for (let username of [...new Set(input)]) {
        let usernameStringTrim = String(username).trim();
        if (validateUserName(usernameStringTrim)) {
            usernameList.push(usernameStringTrim);
        }
        else {
            invalidUsernameList.push(username);
        };
    };

    return new Promise((resolve, reject) => {
        Mongo.db.collection('user').find({ 'auth.username': { $in: usernameList } }).toArray()
            .then((documents) => {
                for (let document of documents) {
                    userThatAlreadyExistList.push(document.auth.username);
                };
                validUsernameList = usernameList.filter(x => !userThatAlreadyExistList.includes(x));
                resolve([validUsernameList, invalidUsernameList, userThatAlreadyExistList]);
            })
            .catch(reject);
    })
};

export default checkUsernameList;
