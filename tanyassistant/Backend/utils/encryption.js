const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY;
const iv = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    const [ivStr, encryptedData] = text.split(':');
    const iv = Buffer.from(ivStr, 'hex');
    const encryptedText = Buffer.from(encryptedData, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };
