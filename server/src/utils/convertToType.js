function convertToType(type, value) {


  if (type === 'Number') {
      return Number(value);
  } else if (type === 'String') {
      return String(value);
  } else if (type === 'Boolean') {
      return Boolean(value);
  } else if (type === 'Date') {
      return new Date(value);
  } else if (type === 'Null') {
      return null;
  } else if (type === 'Object' || type === 'Array') {
      return JSON.parse(JSON.stringify(value));
  } else if (type === 'Undefined') {
      return undefined;
  } else if (type === 'Function') {
      return Function(value);
  } else {
      return 'Cannot convert to the specified type.';
  }

}


export default convertToType;