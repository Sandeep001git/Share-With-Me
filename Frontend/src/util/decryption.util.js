import { derivedKey } from "./deriveKey";

export const decryption = async (encryptedData, iv, salt, passphrase) => {
    try {
        console.log('Starting decryption process...');

        // Log inputs for debugging
        console.log('Encrypted data:', encryptedData);
        console.log('IV:', iv);
        console.log('Salt:', salt);
        console.log('Passphrase:', passphrase);

        // Derive the crypto key using the passphrase and salt
        const key = await derivedKey(passphrase, salt);
        console.log('CryptoKey:', key);

        // Ensure encryptedData is an ArrayBuffer
        const encryptedArrayBuffer = new Uint8Array(encryptedData).buffer;
        console.log('Encrypted data ArrayBuffer:', encryptedArrayBuffer);

        console.log('Type of key:', typeof key);
        console.log('Type of iv:', typeof iv);
        console.log('Type of encryptedArrayBuffer:', typeof encryptedArrayBuffer);

        // Perform decryption
        const decryptedFile = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encryptedArrayBuffer,
        );

        console.log('Decryption successful');
        return new Blob([decryptedFile]);
    } catch (error) {
        console.error('Decryption error:', error);
        throw error; // Rethrow the error to handle it further up the call stack
    }
};
