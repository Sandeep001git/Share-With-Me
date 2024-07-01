import CryptoJS from 'crypto-js';

const getCryptoKey = (password) => {
    return CryptoJS.enc.Hex.parse(CryptoJS.SHA256(password).toString());
};

const decryption = (encryptedData, password, iv) => {
    const key = getCryptoKey(password);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv: CryptoJS.enc.Hex.parse(iv)
    });
    return decrypted;
};

export { decryption };
