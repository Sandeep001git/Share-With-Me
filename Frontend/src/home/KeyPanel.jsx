/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { peerConnectionUser } from "../Api/index.js";
import { usePeerContext } from "../peer/Peer.jsx";
import File from "./File";
import { decryption } from "../util/decryption.util.js";

function KeyPanel() {
    const [userInput, setUserInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const { peer, conn, setConn } = usePeerContext();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [chunk, setChunk] = useState({});
    const [salt,setSalt] = useState(null)
    const receivedChunks = [];
    let totalChunks = 0;
    const fileData = {
        fileName: "",
        fileType: "",
        fileSize: "",
    };
    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

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
                    connection.on("data", async (message) => {
                        if (message.type == "metadata") {
                            console.log(message)
                            totalChunks = message.totalChunks;
                            fileData.fileName = message.fileName;
                            fileData.fileType = message.fileType;
                            fileData.fileSize = message.fileSize;
                            setSalt(()=>new Uint8Array(message.salt));
                        } else if (message.type === "chunk"){
                            console.log(message)
                            const { iv, data, chunkIndex } = message;
                            const encryptedData = new Uint8Array(data).buffer;
                            const ivArray = new Uint8Array(iv);
                            setChunk({ ivArray, encryptedData, chunkIndex });
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
        const processChunk = async () => {
            try {
                if (chunk.ivArray && salt) {
                    const password = import.meta.env.VITE_ENCRYPTION_AND_DECRYPTION_PASSWORD;
                    const { encryptedData, ivArray, chunkIndex } = chunk;
                    const decryptedChunk = await decryption(encryptedData, ivArray, salt, password);
                    if(!decryptedChunk){
                        console.log(decryptedChunk)
                        console.log('error')
                    }
                    receivedChunks[chunkIndex] = decryptedChunk;
                    console.log("Chunk decrypted:", { chunkIndex, decryptedChunk });

                    if (isTransferComplete()) {
                        const fileBlob = new Blob(receivedChunks, { type: fileData.fileType });
                        console.log("File received and reconstructed:", fileBlob);
                    }
                } else {
                    console.log('No data is sent or salt is missing', { chunk, salt: salt });
                }
            } catch (error) {
                console.error("Error processing chunk:", error);
            }
        };
        processChunk();
    }, [chunk, fileData.salt]);

    const removeFile = (fileToRemove) => {
        setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
    };

    function isTransferComplete() {
        return (
            receivedChunks.length === totalChunks &&
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
                                    No files sended yet.
                                </div>
                            ) : (
                                selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="w-full md:w-1/2 lg:w-1/3 p-2"
                                    >
                                        <File
                                            file={fileData}
                                            onDelete={() => removeFile(file)}
                                        />
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
                            placeholder="Enter your secret Code"
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
