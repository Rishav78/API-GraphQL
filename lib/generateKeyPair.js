const util = require('util');
const crypto = require('crypto');
const generateKeyPair = util.promisify(crypto.generateKeyPair);

exports.generateKeyPair = async () => {
    return await generateKeyPair('rsa', {
        modulusLength: process.env.MODULE_LENGTH,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem'
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
          cipher: process.env.CIPHER,
          passphrase: process.env.PASSPHRASE
        }
      });
}