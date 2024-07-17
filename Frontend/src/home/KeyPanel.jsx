import { useEffect, useState } from "react";
import { peerConnectionUser, deleteReciver } from "../Api/index.js";
import { usePeerContext } from "../peer/Peer.jsx";
import { closeConnection } from "../config/configuration.js";
import File from "./File";
import { useNavigate } from "react-router-dom";
import fileImage from "../assets/file_download.png";
import ErrorPage from "./ErrorPage.jsx";

function KeyPanel() {
    const [userInput, setUserInput] = useState("");
    const [img, setImg] = useState("");
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
    const [error, setError] = useState(null);

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
                            setFileData({
                                fileName: message.fileName,
                                fileType: message.fileType,
                                fileSize: message.fileSize,
                                totalChunks: message.totalChunks,
                            });
                            setReceivedChunks([]); 
                            setProgress(0);
                            setImg(fileImage);
                        } else if (message.type === "chunk") {
                            const { data, chunkIndex } = message;
                            const dataArray = new Uint8Array(data);
                            setReceivedChunks((prevChunks) => {
                                const updatedChunks = [...prevChunks];
                                updatedChunks[chunkIndex] = dataArray;
                                return updatedChunks;
                            });
                        } else if (message.type === "aborted") {
                            setSelectedFiles((prevFiles) =>
                                prevFiles.slice(0, -1)
                            );
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
                        setError({status:500,message:err})
                        setIsConnected(false);
                    });
                } else {
                    setError({status:500,message:sender.message})
                }
            }
        } catch (error) {
            setError({status:500,message:'Connection Error'})
        }
    };

    useEffect(() => {
        if (fileData.totalChunks > 0) {
            const nonEmptyChunks = receivedChunks.filter(chunk => chunk !== undefined).length;
            const progress = Math.round((nonEmptyChunks / fileData.totalChunks) * 100);
            setProgress(progress);
        }
    }, [receivedChunks, fileData.totalChunks]);

    useEffect(() => {
        if (receivedChunks.length > 0 && isTransferComplete()) {
            const fileBlob = new Blob(receivedChunks, {
                type: fileData.fileType,
            });
            const fileUrl = URL.createObjectURL(fileBlob);
            const filePreview = {
                ...fileData,
                url: fileUrl,
                name: fileData.fileName,
                size: fileData.fileSize,
            };
            setSelectedFiles([filePreview]); // Show the file as soon as the first chunk is received and update progressively

            // Clear file data and chunks after completion
            setFileData({
                fileName: "",
                fileType: "",
                fileSize: "",
                totalChunks: 0,
            });
            setReceivedChunks([]);
            setProgress(0);
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

    if(error){
        return <ErrorPage error={error}/>
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {isConnected ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="bg-white p-8 rounded shadow-md w-2/3">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                File Received
                            </h2>
                            <button
                                onClick={restartNewConnection}
                                className="ml-auto px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                New Connection
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {selectedFiles.length === 0 ? (
                                <div className="w-full text-center font-bold text-lg text-gray-500">
                                    No files received yet.
                                </div>
                            ) : (
                                selectedFiles.map((file, index) => (
                                    <div key={index} className="w-full p-2">
                                        <File
                                            file={file}
                                            default_img={img}
                                            onDelete={() => removeFile(file)}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center">
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
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-2/3">
                <div className="bg-gray-200 h-2 rounded-md mb-20">
                    <div
                        className="bg-indigo-600 h-2"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default KeyPanel;
