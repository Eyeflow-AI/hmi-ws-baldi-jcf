function getMissingKeysFromObject(body, requiredKeys) {
    let bodyKeys = Object.keys(body);
    let missingKeys = [];
    for (let key of requiredKeys) {
        if (!bodyKeys.includes(key)) {
            missingKeys.push(key);
        };
    };

    return missingKeys;
};

export default getMissingKeysFromObject;
