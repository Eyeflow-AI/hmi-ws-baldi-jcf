import Mongo from '../../../components/mongo';

function getAccessControlDocument() {
    return new Promise((resolve, reject) => {
        Mongo.db.collection('params').findOne({ 'name': 'accessControl' })
            .then((result) => {
                if (result) {
                    resolve(result)
                }
                else {
                    let err = new Error('Missing accessControl document in params collection');
                    reject(err);
                }
            })
            .catch(reject);
    });
};

export default getAccessControlDocument;