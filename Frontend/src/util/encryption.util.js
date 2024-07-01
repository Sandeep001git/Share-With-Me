import CryptoJS from "crypto-js";


const getCryptoKey = (password) => {
    return CryptoJS.enc.Hex.parse(CryptoJS.SHA256(password).toString());
};

const encryption = (file, password) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader(); // Create a new FileReader to read the file content

        reader.onload = () => {
            const wordArray = CryptoJS.lib.WordArray.create(reader.result);
            // Convert the file content to a WordArray, which is a type used by CryptoJS

            const key = getCryptoKey(password); // Generate a cryptographic key from the password
            const iv = CryptoJS.lib.WordArray.random(16); // Generate a random initialization vector (IV)

            const encrypted = CryptoJS.AES.encrypt(wordArray, key, { iv });
            // Encrypt the WordArray using AES with the generated key and IV

            resolve({
                encryptedFile: encrypted.toString(), // Convert the encrypted data to a string
                iv: iv.toString(CryptoJS.enc.Hex), // Convert the IV to a hex string
            });
        };

        reader.onerror = (error) => reject(error); // Handle any errors that occur during file reading
        reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    });
};

export { encryption };
