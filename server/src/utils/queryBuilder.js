import { BSON, EJSON, ObjectId } from 'bson';

const _replaceAll = function (text, search, replacement) {
  let newText = text;
  return newText.split(search).join(replacement);
};


function functionEvaluator({ value, func, variableName }) {
  let prepareFunc = _replaceAll(func, `{{${variableName}}}`, value);
  let result = eval(prepareFunc);
  return result;
}

function variablesReplacer({ obj, variables, variablesInfo }) {
  try {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i] !== null && typeof obj[i] === 'object') {
          obj[i] = variablesReplacer({ obj: obj[i], variables, variablesInfo });
        }
      };
    }
    else {
      for (let [key, value] of Object.entries(obj)) {
        if (value !== null && typeof value === 'object') {
          variablesReplacer({ obj: value, variables, variablesInfo });
        }
        else if (typeof (value) === 'string') {
          if (value.includes("{{")) {
            let regexp = /{{\w+}}/g;
            let replaceStr = regexp.exec(value)?.input ?? '';

            if (replaceStr) {
              let variableName = replaceStr.split('{{')[1].split('}}')[0].replace('}}}', '');
              let resultCalculation = variables?.[variableName] ?? '';
              if (variablesInfo?.[variableName]?.function) {
                resultCalculation = functionEvaluator({
                  value: variables?.[variableName],
                  func: variablesInfo?.[variableName]?.function,
                  variableName,
                })
              }

              if (replaceStr.includes(':')) {
                let _value = replaceStr.split(' ')[1].replace(`{{${variableName}}`, resultCalculation).replace('}}', '');
                let _key = replaceStr.split(' ')[0].replace('{', '').replace(':', '');
                obj[key] = EJSON.parse(JSON.stringify({ [_key]: _value }));
              }
              else {
                let _value = replaceStr.replace(`{{${variableName}`, resultCalculation).replace('}}', '');
                obj[key] = _value;
              }
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
  let queryOBJ = variablesReplacer({ obj: query?.pipeline, variables, variablesInfo: query?.variables });
  return queryOBJ;
}
