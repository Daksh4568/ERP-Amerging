const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_SECRET;
const iv = crypto.randomBytes(16);

// to decrypt the password
const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (encryptedText) => {
    const [ivHex, encrypted] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(ivHex, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);
    return decrypted.toString();
};
module.exports = { encrypt, decrypt };
