import { useSelector } from "react-redux";
import { FaRegCopy} from "react-icons/fa"

function SenderKey() {
    const user=useSelector((state)=>state.User)
    const copyToClipboard =()=>{
        navigator.clipboard.writeText(user[0].data.data.secreateCode)
    }
    
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Secret Key</h2>
        <div className="flex items-center justify-between p-4 border border-gray-300 rounded-md">
            <span className="text-gray-700">{user[0].data.data.secreateCode}</span>
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

export default SenderKey