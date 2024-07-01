import {
    ApiError,
    ApiResponse,
    encryption,
    decryption,
} from "../util/index.js";


const fileSharing = async (file,peer) => {
    
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
        console.log(peer)
        peer.on('open',(conn)=>{
          console.log(conn)
          conn.send(dataToSend)
        })

        return new ApiResponse(200, "File sent successfully");
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
        const blob = new Blob([decryptedFile], {
            type: "application/octet-stream",
        });

        const fileURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = "receivedFile"; // Provide a name for the downloaded file
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(fileURL);
    });
};

const closeConnection = (peer) => {
    peer.close();
};

export { fileSharing, closeConnection, receiverDataStorage };
