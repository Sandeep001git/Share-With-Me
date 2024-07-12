import { derivedKey } from "./deriveKey";

export const decryption = async (encryptedData, iv, salt, passphrase) => {
        const key = await derivedKey(passphrase, salt);

        if (!(encryptedData instanceof ArrayBuffer)) {
            throw new Error('encryptedData must be an ArrayBuffer');
        }

        const encryptedArrayBuffer = new Uint8Array(encryptedData).buffer;

        if (!(iv instanceof ArrayBuffer || ArrayBuffer.isView(iv))) {
            throw new Error('IV must be an ArrayBuffer or a TypedArray');
        }

        const decryptedFile =await  crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            key,
            encryptedArrayBuffer,
        );

        console.log('decryption succesfully');
        return new Blob([decryptedFile]);
    
};
