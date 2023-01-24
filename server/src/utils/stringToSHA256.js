import { createHash } from 'crypto';

function stringToSHA256(string) {
  return createHash('sha256').update(string).digest('hex');
};

export default stringToSHA256;