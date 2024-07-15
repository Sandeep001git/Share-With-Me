import { useEffect, useState } from "react";
import { peerConnectionUser } from "../Api/index.js";
import { usePeerContext } from "../peer/Peer.jsx";
import File from "./File";

function KeyPanel() {
    const [userInput, setUserInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const { peer } = usePeerContext();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [receivedChunks, setReceivedChunks] = useState([]);
    const [fileData, setFileData] = useState({
        fileName: "",
        fileType: "",
        fileSize: "",
        totalChunks: 0,
    });
    const [progress, setProgress] = useState(0);

    const handleClick = async () => {
        try {
            const sender = await peerConnectionUser(userInput);
            const { senderPeerId } = sender.data.data;
            if (senderPeerId) {
                const connection = peer.connect(senderPeerId);
                if (connection) {
                    connection.on("open", () => {
                        setIsConnected(true);
                    });
                    connection.on("data", (message) => {
                        if (message.type === "metadata") {
                            console.log("Metadata received:", message);
                            setFileData({
                                fileName: message.fileName,
                                fileType: message.fileType,
                                fileSize: message.fileSize,
                                totalChunks: message.totalChunks,
                            });
                            setReceivedChunks([]);
                            setProgress(0);
                        } else if (message.type === "chunk") {
                            console.log("Chunk received:", message);
                            const { data, chunkIndex } = message;
                            const dataArray = new Uint8Array(data);
                            setReceivedChunks((prevChunks) => {
                                const updatedChunks = [...prevChunks];
                                updatedChunks[chunkIndex] = dataArray;
                                return updatedChunks;
                            });
                            // Update progress
                            console.log(fileData.totalChunks);
                            if (
                                fileData.totalChunks &&
                                chunkIndex !== undefined
                            ) {
                                const chunckVal = chunkIndex + 1;
                                const progress = Math.round(
                                    (chunckVal / fileData.totalChunks) * 100
                                );
                                setProgress(progress);
                                console.log(chunckVal);
                            }
                        }
                    });
                    connection.on("error", (err) => {
                        console.error("Connection error:", err);
                        setIsConnected(false);
                    });
                } else {
                    console.error(
                        "Error:",
                        sender.message || "Cannot connect to peer"
                    );
                }
            }
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    useEffect(() => {
        handleClick(); // Call handleClick directly in useEffect
    }, [userInput, peer]);

    useEffect(() => {
        if (isTransferComplete()) {
            const fileBlob = new Blob(receivedChunks, {
                type: fileData.fileType,
            });
            const fileUrl = URL.createObjectURL(fileBlob);
            setSelectedFiles((prevFile) => [
                ...prevFile,
                {
                    ...fileData,
                    url: fileUrl,
                    name: fileData.fileName,
                    size: fileData.fileSize,
                },
            ]); // Assuming only one file for simplicity
            console.log("File received and reconstructed:", fileBlob);
        }
    }, [receivedChunks, fileData]);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const removeFile = (fileToRemove) => {
        setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
    };

    function isTransferComplete() {
        return (
            receivedChunks.length === fileData.totalChunks &&
            !receivedChunks.includes(undefined)
        );
    }

    return (
        <>
            {isConnected ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-8 rounded shadow-md w-2/3">
                        <h2 className="text-2xl font-bold mb-6">
                            File Receiver
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedFiles.length === 0 ? (
                                <div className="w-full text-center font-bold text-lg content-center align-middle text-gray-500">
                                    No files received yet.
                                </div>
                            ) : (
                                selectedFiles.map((file, index) => (
                                    <div key={index} className="w-full p-2">
                                        <File
                                            file={file}
                                            onDelete={() => removeFile(file)}
                                        />
                                        <div className="w-full bg-gray-200 rounded-full mt-2">
                                            <div
                                                className="bg-indigo-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            >
                                                {progress}%
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <label
                            className="block text-gray-700 text-lg font-bold mb-2"
                            htmlFor="secretCode"
                        >
                            Secret Code
                        </label>
                        <input
                            type="text"
                            id="secretCode"
                            value={userInput}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your secret code"
                        />
                        <button
                            type="button"
                            id="secret-code-btn"
                            onClick={handleClick}
                            className="mt-3 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default KeyPanel;
