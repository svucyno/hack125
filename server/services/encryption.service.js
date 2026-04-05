const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypts sensitive data using AES-256-GCM.
 * @param {string} text - The plaintext to encrypt.
 * @returns {string} - The encrypted string in format: iv:authTag:encryptedText
 */
const encrypt = (text) => {
    if (!text) return text;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

/**
 * Decrypts sensitive data using AES-256-GCM.
 * @param {string} encryptedData - The encrypted string in format: iv:authTag:encryptedText
 * @returns {string} - The decrypted plaintext.
 */
const decrypt = (encryptedData) => {
    if (!encryptedData || !encryptedData.includes(':')) return encryptedData;
    
    try {
        const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');
        const decipher = crypto.createDecipheriv(
            ALGORITHM, 
            Buffer.from(ENCRYPTION_KEY, 'hex'), 
            Buffer.from(ivHex, 'hex')
        );
        
        decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
        
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Decryption failed:', error.message);
        return '[ENCRYPTED DATA]';
    }
};

module.exports = { encrypt, decrypt };
