// /**
// * 
// */

import Mongo from "../../../components/mongo";


async function putActiveLanguage(req, res, next) {
  try {
    let languageId = req?.body?.languageId ?? '';
    let status = req?.body?.status ?? false;
    if (languageId) {

      let usedLanguages = await Mongo.db.collection('params').findOneAndUpdate({
        name: 'feConfig',
        'locale.languageList.id': languageId
      },
        {
          $set: {
            datetime: new Date(),
            'locale.languageList.$.active': status
          }
        }, { returnDocument: 'after' });
      usedLanguages = usedLanguages?.value?.locale ?? {};
      res.status(200).json({ usedLanguages });
    }
    else {
      res.status(204).json('No languageId informed');
    }
  }
  catch (err) {
    // console.log({ err })
    res.status(204).json({ err })
  }
};

export default putActiveLanguage;