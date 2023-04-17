// /**
// * 
// */

import Mongo from "../../../components/mongo";


async function putDefaultLanguage(req, res, next) {
  try {
    let languageId = req?.body?.languageId ?? '';
    if (languageId) {

      let usedLanguages = await Mongo.db.collection('params').findOneAndUpdate({
        name: 'feConfig',
      },
        {
          $set: {
            datetime: new Date(),
            'locale.default': languageId
          }
        },
        { returnDocument: 'after' }
      );
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

export default putDefaultLanguage;