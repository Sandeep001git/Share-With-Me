import { useEffect, useState } from "react";
import { peerConnectionUser, deleteReciver } from "../Api/index.js";
import { usePeerContext } from "../peer/Peer.jsx";
import { closeConnection } from "../config/configuration.js";
import File from "./File";
import { useNavigate } from "react-router-dom";

function KeyPanel() {
    const [userInput, setUserInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const { peer, setConn, conn } = usePeerContext();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [receivedChunks, setReceivedChunks] = useState([]);
    const [fileData, setFileData] = useState({
        fileName: "",
        fileType: "",
        fileSize: "",
        totalChunks: 0,
    });
    const [progress, setProgress] = useState(0);
    const [id, setId] = useState("");
    const navigate = useNavigate();

    const handleClick = async () => {
        try {
            const sender = await peerConnectionUser(userInput);
            const { senderPeerId } = sender.data.data;
            const { data } = JSON.parse(window.localStorage.getItem("user"));
            const id = data._id;
            setId(id);
            if (senderPeerId) {
                const connection = peer.connect(senderPeerId);
                setConn(connection);
                if (connection) {
                    connection.on("open", () => {
                        setIsConnected(true);
                    });
                    connection.on("data", async (message) => {
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
                        } else if (message.type === "aborted") {
                            setSelectedFiles((prevFiles) => prevFiles.slice(0, -1));
                            setFileData({
                                fileName: "",
                                fileType: "",
                                fileSize: "",
                                totalChunks: 0,
                            });
                            setProgress(0);
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
        if (fileData.totalChunks > 0) {
            const lastChunkIndex = receivedChunks.length - 1;
            if (lastChunkIndex >= 0) {
                const totalchunks = fileData.totalChunks;
                const chunkVal = lastChunkIndex + 1;
                const progress = Math.round((chunkVal / totalchunks) * 100);
                setProgress(progress);
                console.log(`Progress: ${progress}%`);
            }
        }
    }, [receivedChunks, fileData]);

    useEffect(() => {
        if (isTransferComplete()) {
            const fileBlob = new Blob(receivedChunks, {
                type: fileData.fileType,
            });
            const fileUrl = URL.createObjectURL(fileBlob);
            setSelectedFiles((prevFiles) => [
                ...prevFiles,
                {
                    ...fileData,
                    url: fileUrl,
                    name: fileData.fileName,
                    size: fileData.fileSize,
                },
            ]); // Assuming only one file for simplicity
            console.log("File received and reconstructed:", fileBlob);
            setFileData({
                fileName: "",
                fileType: "",
                fileSize: "",
                totalChunks: 0,
            });
        }
    }, [receivedChunks]);

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

    const restartNewConnection = async () => {
        const response = await deleteReciver(id);
        console.log(response);
        if (response) {
            setIsConnected(false);
            setUserInput("");
            setSelectedFiles([]);
            setReceivedChunks([]);
            setFileData({
                fileName: "",
                fileType: "",
                fileSize: "",
                totalChunks: 0,
            });
            setProgress(0);
            if (conn != null) {
                closeConnection(conn);
            }
            peer.destroy();
            navigate("/");
        }
    };

    return (
        <>
            {isConnected ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-8 rounded shadow-md w-2/3">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                File Receiver
                            </h2>
                            <button
                                onClick={restartNewConnection}
                                className="ml-auto px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                New Connection
                            </button>
                        </div>
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
