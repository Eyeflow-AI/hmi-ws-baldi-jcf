import getAccessControlDocument from '../utils/getAccessControlDocument';

async function getAccessControlData(req, res, next) {

    try {
        res.json({
            ok: true,
            data: await getAccessControlDocument()
        });
    }
    catch (err) {
        next(err);
    };
};

export default getAccessControlData;