/**
 * Secure Storage Utility (Enhanced)
 * Uses AES-256 Encryption via crypto-js to protect local data.
 */
import CryptoJS from 'crypto-js';

// In a real production app, this key should not be hardcoded in the client bundle.
// It would typically be derived from a user's password or fetched from a secure environment.
const SECRET_KEY = 'smart-crop-advisor-v1-secure-aes-key';

const encrypt = (data) => {
    try {
        const jsonString = JSON.stringify(data);
        // AES-256 Encryption
        return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    } catch (e) {
        console.error('Encryption failed', e);
        return null;
    }
};

const decrypt = (cipherText) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) return null;

        return JSON.parse(decryptedString);
    } catch (e) {
        console.warn('Decryption failed or invalid data format', e);
        return null;
    }
};

export const secureSave = (key, data) => {
    const encrypted = encrypt(data);
    if (encrypted) {
        localStorage.setItem(key, encrypted);
    }
};

export const secureGet = (key) => {
    const cipher = localStorage.getItem(key);
    if (!cipher) return null;

    // Attempt to decrypt
    const data = decrypt(cipher);
    if (data !== null) return data;

    // Fallback: If decryption fails, check if it's plain JSON (legacy data cleanup)
    try {
        const plain = JSON.parse(cipher);
        // Automatically upgrade to encrypted storage if possible
        secureSave(key, plain);
        return plain;
    } catch {
        return null;
    }
};
