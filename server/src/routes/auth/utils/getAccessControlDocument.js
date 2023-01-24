import Mongo from '../../../components/mongo';

function getAccessControlDocument() {
    return new Promise((resolve, reject) => {
        Mongo.db.collection('parms').findOne({ 'name': 'accessControl' })
            .then((result) => {
                if (result) {
                    resolve(result)
                }
                else {
                    let err = new Error('Missing accessControl document in parms collection');
                    reject(err);
                }
            })
            .catch(reject);
    });
};

export default getAccessControlDocument;