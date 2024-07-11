export const derivedKey = async (passphrase, salt) => {
    const encoder = new TextEncoder();
    const passphraseKey = encoder.encode(passphrase);

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passphraseKey,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    const saltArray = new Uint8Array(salt);

    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: saltArray,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        {
            name: 'AES-GCM',
            length: 256
        },
        true,
        ['encrypt', 'decrypt']
    );

    return key;
};
