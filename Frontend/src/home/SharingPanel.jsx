import { File, SenderKey } from "./index.js";
import { useState } from "react";
import { sendFile } from "../peer/peer.js";

function SharingPanel() {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFiles([...selectedFiles, event.target.files[0]]);
        sendFile(selectedFiles)
    };

    const handleUploadClick = () => {
        document.getElementById("fileInput").click();
    };

    const removeFile = (fileToRemove) => {
        setSelectedFiles(selectedFiles.filter((file) => file !== fileToRemove));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="container mx-auto p-4">
                <div className="flex justify-between mb-4">
                    <div className="p-4 bg-white rounded-lg shadow-md w-1/2">
                        <h2 className="text-xl font-bold mb-2">Upload a File</h2>
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
                    <SenderKey />
                </div>

                <div className="flex flex-wrap">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="w-full md:w-1/2 lg:w-1/3 p-2">
                            <File file={file} onDelete={() => removeFile(file)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SharingPanel;
