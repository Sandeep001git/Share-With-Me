import {
    ApiError,
    // ApiResponse,
    encryption,
} from "../util/index.js";
// Function to handle file sharing
const fileSharing = async (file, conn) => {
    try {
        if (!file) {
            throw new ApiError(400, "No file provided");
        }

        // Calculate chunk size and total number of chunks
        const CHUNK_SIZE = 16 * 1024; // 16 KB
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        // Generate a random salt for encryption
        const salt = crypto.getRandomValues(new Uint8Array(16));

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
                    // Encrypt the chunk
                    const { encryptedFile, iv } = await encryption(chunk, encAndDecPass);
                    console.log(encryptedFile)
                    if (conn.open) {
                        conn.send({
                            type: 'chunk',
                            iv: Array.from(iv),
                            data: Array.from(new Uint8Array(encryptedFile)),
                            chunkIndex: chunkIndex,
                        });
                        
                        // Throttle sending to avoid overwhelming the connection
                        console.log(encryptedFile)
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
