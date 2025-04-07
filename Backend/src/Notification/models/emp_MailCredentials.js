const mongoose = require('mongoose');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32 bytes key
const iv = crypto.randomBytes(16); // 16 bytes IV

const empCredentialSchema = new mongoose.Schema({
    eID: { type: String, required: true },
    officialMail: { type: String, required: true },
    empName: { type: String, required: true },
    officialMailpassword: { type: String, required: true }, // encrypted
    iv: { type: String, required: true } // store the IV for decryption
});

// Encrypt before saving
empCredentialSchema.pre('save', function (next) {
    if (this.isModified('officialMailpassword')) {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(this.officialMailpassword, 'utf-8', 'hex');
        encrypted += cipher.final('hex');

        this.officialMailpassword = encrypted;
        this.iv = iv.toString('hex');
    }
    next();
});

module.exports = mongoose.model('EmpCredentials', empCredentialSchema);
