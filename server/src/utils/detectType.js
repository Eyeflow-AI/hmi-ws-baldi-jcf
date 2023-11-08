function detectType(value) {

  if (typeof value === 'number') {
      return 'Number';
  } else if (typeof value === 'string') {
      return 'String';
  } else if (typeof value === 'boolean') {
      return 'Boolean';
  } else if (Array.isArray(value)) {
      return 'Array';
  } else if (value instanceof Date) {
      return 'Date';
  } else if (value === null) {
      return 'Null';
  } else if (typeof value === 'object') {
      return 'Object';
  } else if (value === undefined) {
      return 'Undefined';
  } else if (typeof value === 'function') {
      return 'Function';
  } else {
      return 'Unknown Type';
  }
}

export default detectType;