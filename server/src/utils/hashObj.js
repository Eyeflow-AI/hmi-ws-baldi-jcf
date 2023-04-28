import hashCode from "./hashCode";

function sortObjectKeys(obj){
    if(obj == null || obj == undefined){
        return obj;
    }
    if(typeof obj != 'object'){ // it is a primitive: number/string (in an array)
        return obj;
    }
    return Object.keys(obj).sort().reduce((acc,key)=>{
        if (Array.isArray(obj[key])){
            acc[key]=obj[key].map(sortObjectKeys);
        }
        else if (typeof obj[key] === 'object'){
            acc[key]=sortObjectKeys(obj[key]);
        }
        else{
            acc[key]=obj[key];
        }
        return acc;
    },{});
};

let hashObj = function(Obj)
{
    let SortedObject = sortObjectKeys(Obj);
    let jsonstring = JSON.stringify(SortedObject, function(k, v) { return v === undefined ? "undef" : v; });

    // Remove all whitespace
    let jsonstringNoWhitespace = jsonstring.replace(/\s+/g, '');
    return hashCode(jsonstringNoWhitespace);
}

export default hashObj;