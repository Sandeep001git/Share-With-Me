import {
    ApiError,
    // ApiResponse,
    encryption,
} from "../util/index.js";

const fileSharing = async (file, conn) => {
    try {
        if (!file) {
            throw new ApiError(400, "No file provided");
        }

        const CHUNK_SIZE = 16 * 1024;
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const salt = crypto.getRandomValues(new Uint8Array(16)); // Generate a random salt

        if (!conn || !conn.open) {
            throw new ApiError(500, "Connection not open");
        }

        const encAndDecPass = import.meta.env.VITE_ENCRYPTION_AND_DECRYPTION_PASSWORD;
        if (!encAndDecPass) {
            throw new ApiError(500, "Encryption password not found");
        }

        conn.send({
            type: 'metadata',
            totalChunks: totalChunks,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            salt: Array.from(salt) // Convert to array for transmission
        });

        let chunkIndex = 0;

        const sendChunk = async () => {
            if (chunkIndex >= totalChunks) {
                console.log('File sent completely');
                return;
            }

            const start = chunkIndex * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);

            try {
                const { encryptedFile, iv } = await encryption(chunk, encAndDecPass);

                if (conn.open) {
                    conn.send({
                        type: 'chunk',
                        iv: Array.from(iv), // Convert to array for transmission
                        data: Array.from(new Uint8Array(encryptedFile)), // Convert to array for transmission
                        chunkIndex: chunkIndex,
                    });

                    chunkIndex++;
                    setTimeout(sendChunk, 100); // Throttle sending to avoid overwhelming the connection
                } else {
                    throw new ApiError(500, "Connection is closed");
                }
            } catch (error) {
                console.error("Error during chunk encryption or sending:", error);
                throw new ApiError(500, "Error occurred during chunk encryption or sending");
            }
        };

        sendChunk();
    } catch (error) {
        console.error("Error during file sharing:", error);
        throw new ApiError(500, "Error occurred during file sharing");
    }
};


const closeConnection = (peer) => {
    peer.destroy();
};

export { fileSharing, closeConnection };
