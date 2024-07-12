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

        const CHUNK_SIZE = 64 * 1024;
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const salt = crypto.getRandomValues(new Uint8Array(16)); // Generate a random salt

        if (!conn || !conn.open) {
            throw new ApiError(500, "Connection not open");
        }

        const encAndDecPass = import.meta.env.VITE_ENCRYPTION_AND_DECRYPTION_PASSWORD;
        if (!encAndDecPass) {
            throw new ApiError(500, "Encryption password not found");
        }

        // Send metadata first
        conn.send({
            type: 'metadata',
            totalChunks: totalChunks,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            salt: Array.from(salt) // Convert to array for transmission
        });

        // Function to send chunks sequentially
        const sendChunks = async () => {
            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                const start = chunkIndex * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);

                try {
                    const { encryptedFile, iv } = await encryption(chunk, encAndDecPass);

                    if (conn.open) {
                        conn.send({
                            type: 'chunk',
                            iv: Array.from(iv),
                            data: Array.from(new Uint8Array(encryptedFile)),
                            chunkIndex: chunkIndex,
                        });

                        // Throttle sending to avoid overwhelming the connection
                        await new Promise(resolve => setTimeout(resolve, 200));
                    } else {
                        throw new ApiError(500, "Connection is closed");
                    }
                } catch (error) {
                    console.error("Error during chunk encryption or sending:", error);
                    throw new ApiError(500, "Error occurred during chunk encryption or sending");
                }
            }

            console.log('File sent completely');
        };

        // Call sendChunks function to initiate chunk sending
        await sendChunks();
    } catch (error) {
        console.error("Error during file sharing:", error);
        throw new ApiError(500, "Error occurred during file sharing");
    }
};

const closeConnection = (peer) => {
    peer.destroy();
};

export { fileSharing, closeConnection };
