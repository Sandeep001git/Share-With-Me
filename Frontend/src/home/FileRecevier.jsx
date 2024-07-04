// FileReceiver.js
import { useEffect, useState } from "react";
import { usePeer } from "../peer/Peer.jsx";
import { receiverDataStorage } from "../config/configuration.js";

const FileReceiver = () => {
    const [files, setFiles] = useState([]);
    const peer = usePeer();

    useEffect(() => {
        if (peer) {
            peer.on("connection", (conn) => {
                conn.on("data", async (data) => {
                    console.log("File received:", data);

                    try {
                        const receivedData = JSON.parse(data);
                        const decryptedFile = receiverDataStorage(receivedData.encryptedFile, receivedData.iv);
                        
                        const blob = new Blob([decryptedFile], {
                            type: "application/octet-stream",
                        });

                        const fileURL = URL.createObjectURL(blob);
                        setFiles((prevFiles) => [
                            ...prevFiles,
                            { name: "Received File", url: fileURL },
                        ]);

                        console.log("Decrypted file:", decryptedFile);
                    } catch (error) {
                        console.error("Error during file reception or decryption:", error);
                    }
                });
            });
        }
    }, [peer]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">File Receiver</h2>
                {files.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Received Files:</h3>
                        <ul className="list-disc pl-5">
                            {files.map((file, index) => (
                                <li key={index} className="mt-2">
                                    <a
                                        href={file.url}
                                        download={file.name}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        {file.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileReceiver;
