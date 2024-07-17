import PropTypes from "prop-types";
import { ApiError } from "../util/ApiError.js";

function File({ file, default_img, onDelete }) {
    let fileUrl = "";

    try {
        if (file.url) {
            fileUrl = file.url;
        } else if (file instanceof Blob) {
            fileUrl = URL.createObjectURL(file);
        } else {
            throw new ApiError(400, "Invalid file type provided");
        }
    } catch (error) {
        console.error("Error creating object URL:", error);
        throw new ApiError(500, "Failed to create object URL for the file");
    }

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 m-2">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <img
                        src={fileUrl || default_img}
                        alt={default_img}
                        className="w-16 h-16 object-cover"
                    />
                </div>
                <div className="ml-4">
                    <div className="text-lg font-bold">{file.name}</div>
                    <div className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-between">
                <a
                    href={fileUrl}
                    download
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                >
                    download
                </a>
                <button
                    onClick={() => onDelete(file)}
                    className="text-red-600 hover:text-red-900"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

File.propTypes = {
    file: PropTypes.object.isRequired,
    default_img: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default File;
