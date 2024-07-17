import { useState, useEffect, useRef } from "react";
import { usePeerContext } from "../peer/Peer.jsx";
import { closeConnection, fileSharing } from "../config/configuration.js";
import { ApiError } from "../util/ApiError.js";
import { File, SenderKey, Loading } from "./index.js";
import { deleteSender } from "../Api/index.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SharingPanel() {
    const { peer, conn, setConn } = usePeerContext();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [waiting, setWaiting] = useState(true);
    const [progress, setProgress] = useState(0);
    const isAbortedRef = useRef(false);
    const user = useSelector((state) => state.User);
    const { _id, secreateCode } = user[0].data;
    const navigate = useNavigate();

    async function handleFileChange(event) {
        if (!conn) {
            throw new ApiError(401, "Connection is not established yet");
        }
        const file = event.target.files[0];
        setSelectedFiles((prevFiles) => [...prevFiles, file]);
        isAbortedRef.current = false;
        await fileSharing(file, conn, setProgress, isAbortedRef);
    }

    const handleUploadClick = () => {
        document.getElementById("fileInput").click();
    };

    const removeFile = (fileToRemove) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove));
        isAbortedRef.current = true;
    };

    const restartNewConnection = async () => {
        setConn(null); // Close current connection
        setSelectedFiles([]); // Clear selected files
        setProgress(0); // Reset progress
        setWaiting(true); // Set waiting state to true
        isAbortedRef.current = false; // Reset aborted state if needed
        if (conn != null) {
            closeConnection(conn);
        }
        peer.destroy();
        const response = await deleteSender(_id);
        if (response) {
            navigate("/");
        } else {
            throw new ApiError(404, "Something unexpected happened while deleting user");
        }
    };

    useEffect(() => {
        if (peer) {
            peer.on("connection", (connection) => {
                setWaiting(false);
                connection.on("open", () => {
                    setConn(connection);
                });
            });

            peer.on("disconnect", () => setWaiting(true));
        }
    }, [peer, setConn]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="container mx-auto p-4">
                <div className="flex justify-between mb-4 items-center">
                    <div className="p-4 bg-white rounded-lg shadow-md w-1/2">
                        <h2 className="text-xl font-bold mb-2">
                            Upload a File
                        </h2>
                        <input
                            type="file"
                            id="fileInput"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            onClick={handleUploadClick}
                            className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            Select File
                        </button>
                    </div>
                    <SenderKey secreateCode={secreateCode} />
                </div>
                <div className="flex justify-between mb-4">
                    <div className="p-4 bg-white rounded-lg shadow-md w-full min-h-[300px]">
                        <button
                            onClick={restartNewConnection}
                            className="ml-auto mt-4 mb-5 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            New Connection
                        </button>
                        {waiting ? (
                            <Loading />
                        ) : (
                            <div className="flex flex-wrap min-h-[200px]">
                                {selectedFiles.length === 0 ? (
                                    <div className="w-full text-center font-bold text-lg content-center align-middle text-gray-500">
                                        No files selected yet.
                                    </div>
                                ) : (
                                    selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="w-full md:w-1/2 lg:w-1/3 p-2"
                                        >
                                            <File
                                                file={file}
                                                onDelete={() =>
                                                    removeFile(file)
                                                }
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SharingPanel;
