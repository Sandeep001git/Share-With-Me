import {
    ApiError,
    ApiResponse,
    encryption,
    decryption,
} from "../util/index.js";

const fileSharing = async (file, conn) => {
    if (!file) {
        throw new ApiError(400, "No file provided");
    }
    const encryptionAndDecryptionPassword = import.meta.env
        .VITE_ENCRYPTION_AND_DECRYPTION_PASSWARD;
    if (!encryptionAndDecryptionPassword) {
        throw new ApiError(500, "Encryption password not found");
    }

    const { encryptedFile, iv } = await encryption(
        file,
        encryptionAndDecryptionPassword
    );
    const dataToSend = JSON.stringify({ encryptedFile, iv });
    const {dataChannel} = conn
    console.log(dataChannel)
    const dd = dataChannel.send('hello')
    console.log(dd)
};

const receiverDataStorage = (peer) => {
    const encryptionAndDecryptionPassword = import.meta.env
        .VITE_ENCRYPTION_AND_DECRYPTION_PASSWARD;
    if (!encryptionAndDecryptionPassword) {
        throw new ApiError(500, "Encryption password not found");
    }

    // eslint-disable-next-line no-unused-vars
    let receivedChunks = [];
    // eslint-disable-next-line no-unused-vars
    let totalSize = 0;

    peer.on("data", (data) => {
        const { encryptedFile, iv } = JSON.parse(data);

        const decryptedFile = decryption(
            encryptedFile,
            encryptionAndDecryptionPassword,
            iv
        );
        return decryptedFile;
    });
};

const closeConnection = (peer) => {
    peer.close();
};

export { fileSharing, closeConnection, receiverDataStorage };
