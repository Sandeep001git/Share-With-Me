import { ApiError } from "../util/index.js";

// Function to handle file sharing
const fileSharing = async (file, conn, setProgress, isAbortedRef) => {
    try {
        if (!file) {
            alert( "No file provided");
            return;
        }

        // Calculate chunk size and total number of chunks
        const CHUNK_SIZE = 64 * 1024; // 16 KB
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

        if (!conn || !conn.open) {
            alert("Connection not open");
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
                if (isAbortedRef.current) {
                    conn.send({type:'aborted'})
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
