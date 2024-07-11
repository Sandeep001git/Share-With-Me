import { derivedKey } from "./deriveKey";

export const encryption = async (file, passphrase) => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await derivedKey(passphrase, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const fileBuffer = await file.arrayBuffer();
    const encryptedFile = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        fileBuffer
    );

    return { iv, salt, encryptedFile };
};
