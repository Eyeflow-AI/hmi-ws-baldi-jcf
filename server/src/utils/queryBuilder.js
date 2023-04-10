import { BSON, EJSON, ObjectId } from 'bson';

function variablesReplacer({ obj, variables }) {

  try {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i] !== null && typeof obj[i] === 'object') {
          obj[i] = variablesReplacer({ obj: obj[i], variables });
        }
      };
    }
    else {
      for (let [key, value] of Object.entries(obj)) {
        if (value !== null && typeof value === 'object') {
          variablesReplacer({ obj: value, variables });
        }
        else if (typeof (value) === 'string') {
          if (value.includes("{{")) {
            let regexp = /{{\w+}}/g;
            let replaceStr = regexp.exec(value)?.input ?? '';
            if (replaceStr) {
              let variableName = replaceStr.split('{{')[1].replace('}}}', '');
              let _key = replaceStr.split(' ')[0].replace('{', '').replace(':', '');
              let _value = replaceStr.split(' ')[1].replace(`{{${variableName}}`, variables[variableName]).replace('}}', '');
              obj[key] = EJSON.parse(JSON.stringify({ [_key]: _value }));
            }
          }
        }
      };
    };
    return obj;
  }
  catch (err) {
    err.message = `Error in variablesReplacer function: ${err.message}`;
    throw err;
  };
};

export default function queryBuilder({
  query,
  variables,
}) {
  let queryOBJ = variablesReplacer({ obj: query?.pipeline, variables });
  return queryOBJ;
}