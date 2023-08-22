const crypto = require('crypto');

const generateRandomKey = (length) => {
  return crypto.randomBytes(length).toString('hex');
};

const accessKey = generateRandomKey(32); // Longitud de 32 caracteres en hexadecimal
const secretKey = generateRandomKey(64); // Longitud de 64 caracteres en hexadecimal

console.log('Access Key:', accessKey);
console.log('Secret Key:', secretKey);