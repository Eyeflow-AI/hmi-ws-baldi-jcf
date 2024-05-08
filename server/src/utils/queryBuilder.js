import { BSON, EJSON, ObjectId } from "bson";
import convertToType from "./convertToType";
import detectType from "./detectType";

const _replaceAll = function (text, search, replacement) {
  let newText = text;
  return newText.split(search).join(replacement);
};

function functionEvaluator({ value, func, variableName, resultCalculations }) {
  // console.log({ value, func, variableName, resultCalculations });
  let prepareFunc = "";
  if (value) {
    prepareFunc = _replaceAll(func, `{{${variableName}}}`, value);
  } else {
    prepareFunc = func;
  }
  for (let [key, value] of Object.entries(resultCalculations)) {
    prepareFunc = _replaceAll(prepareFunc, `{{${key}}}`, `"${value}"`);
  }
  let result = null;
  try {
    result = eval(prepareFunc);
  } catch (err) {
    console.log({ err });
  }
  let resultType = detectType(result);
  // console.log({ result, resultType });
  return { result, resultType };
}

function variablesReplacer({
  obj,
  variables,
  variablesInfo,
  resultCalculations,
}) {
  try {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (obj[i] !== null && typeof obj[i] === "object") {
          obj[i] = variablesReplacer({
            obj: obj[i],
            variables,
            variablesInfo,
            resultCalculations,
          });
        }
      }
    } else {
      for (let [key, value] of Object.entries(obj)) {
        if (value !== null && typeof value === "object") {
          variablesReplacer({
            obj: value,
            variables,
            variablesInfo,
            resultCalculations,
          });
        } else if (typeof value === "string") {
          if (value.includes("{{")) {
            let regexp = /{{\w+}}/g;
            let replaceStr = regexp.exec(value)?.input ?? "";
            let resultType = "";

            if (replaceStr) {
              let variableName = replaceStr
                .split("{{")[1]
                .split("}}")[0]
                .replace("}}}", "");
              let resultCalculation = variables?.[variableName] ?? "";
              console.log({
                value,
                replaceStr,
                variableName,
                resultCalculation,
                resultCalculations,
                variablesInfo,
              });

              if (resultCalculation === "") {
                delete obj[key];
                continue;
              }
              resultCalculations[variableName] = resultCalculation;
              if (variablesInfo?.[variableName]?.function) {
                let functionObj = functionEvaluator({
                  value: variables?.[variableName] ?? "",
                  func: variablesInfo?.[variableName]?.function,
                  variableName,
                  resultCalculations,
                });
                // console.log({ functionObj });
                resultCalculation = functionObj?.result ?? "";
                resultType = functionObj?.resultType ?? "";
              }

              if (replaceStr.includes(":")) {
                let _value = replaceStr
                  .split(" ")[1]
                  .replace(`{{${variableName}}`, resultCalculation)
                  .replace("}}", "");

                let _key = replaceStr
                  .split(" ")[0]
                  .replace("{", "")
                  .replace(":", "");
                if (resultType) {
                  _value = convertToType(resultType, _value);
                }
                let _obj = {
                  [_key]: _value,
                };
                obj[key] = EJSON.parse(JSON.stringify(_obj));
              } else {
                let _value = replaceStr
                  .replace(`{{${variableName}`, resultCalculation)
                  .replace("}}", "");
                obj[key] = _value;
              }
            }
          }
        }
      }
    }
    return obj;
  } catch (err) {
    err.message = `Error in variablesReplacer function: ${err.message}`;
    throw err;
  }
}

export default function queryBuilder({ query, variables }) {
  console.dir({ p: query?.pipeline, variables }, { depth: null });
  let queryOBJ = variablesReplacer({
    obj: query?.pipeline ?? query,
    variables,
    // variablesInfo: query?.variables variables,
    variablesInfo: Object.assign(query?.variables, variables),
    resultCalculations: {},
  });
  // console.dir({ queryOBJ }, { depth: null });
  return queryOBJ;
}
