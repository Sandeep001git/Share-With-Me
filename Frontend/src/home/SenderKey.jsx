import { FaRegCopy } from "react-icons/fa";

// eslint-disable-next-line react/prop-types
function SenderKey({secreateCode}) {
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(secreateCode);
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Your Secret Key</h2>
            <div className="flex items-center justify-between p-4 border border-gray-300 rounded-md">
                <span className="text-gray-700 overflow-hidden overflow-ellipsis whitespace-nowrap flex-grow">
                    {secreateCode }
                </span>
                <button
                    onClick={copyToClipboard}
                    className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                >
                    <FaRegCopy size={20} />
                </button>
            </div>
        </div>
    );
}

export default SenderKey;
