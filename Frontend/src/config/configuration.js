import { ApiError } from "../util/index.js";

// Function to handle file sharing
const fileSharing = async (file, conn, setProgress, isAborted = false) => {
    try {
        if (!file) {
            throw new ApiError(400, "No file provided");
        }

        // Calculate chunk size and total number of chunks
        const CHUNK_SIZE = 16 * 1024; // 16 KB
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        if (!conn || !conn.open) {
            throw new ApiError(500, "Connection not open");
        }

        // Send metadata first
        conn.send({
            type: "metadata",
            totalChunks: totalChunks,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
        });

        // Function to send chunks sequentially
        const sendChunks = async () => {
            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                if (isAborted) {
                    console.log("File Sharing is Aborted");
                    return;
                }
                const start = chunkIndex * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);

                try {
                    const arrayBuffer = await chunk.arrayBuffer();
                    if (conn.open) {
                        conn.send({
                            type: "chunk",
                            data: new Uint8Array(arrayBuffer),
                            chunkIndex: chunkIndex,
                        });
                        // Update progress
                        setProgress(
                            Math.round((chunkIndex / totalChunks) * 100)
                        );

                        // Throttle sending to avoid overwhelming the connection
                        await new Promise((resolve) =>
                            setTimeout(resolve, 200)
                        );
                    } else {
                        throw new ApiError(500, "Connection is closed");
                    }
                } catch (error) {
                    console.error("Error during chunk sending:", error);
                    throw new ApiError(
                        500,
                        "Error occurred during chunk sending"
                    );
                }
            }

            console.log("File sent completely");
            setProgress(100); // Set progress to 100% when done
        };

        // Call sendChunks function to initiate chunk sending
        await sendChunks();
    } catch (error) {
        console.error("Error during file sharing:", error);
        throw new ApiError(500, "Error occurred during file sharing");
    }
};

const closeConnection = (peer) => {
    peer.close();
};

export { fileSharing, closeConnection };
