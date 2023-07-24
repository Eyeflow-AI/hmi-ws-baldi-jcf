// /**
// * 
// */

import Mongo from "../../../components/mongo";
async function getLanguagesData(req, res, next) {
  try {
    let availableLanguages = await Mongo.db.collection('params').findOne({ name: 'skeleton_params' }, { projection: { available_languages: 1, _id: 0 } });
    let usedLanguages = await Mongo.db.collection('params').findOne({ name: 'feConfig' }, { projection: { locale: 1, _id: 0 } });
    availableLanguages = availableLanguages?.available_languages ?? {};
    usedLanguages = usedLanguages?.locale ?? {};
    usedLanguages.languageList = usedLanguages.languageList.filter(lang => lang.active)
    res.status(200).json({
      availableLanguages,
      usedLanguages
    });
  }
  catch (err) {
    console.log({ err })
    res.status(204).json({ msg: 'file not found' })
  }
};

export default getLanguagesData;