import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { peerConnectionUser } from '../Api/index.js';
import { usePeer } from '../peer/Peer.jsx';
import ConnectionContext from '../peer/Conn.peer.jsx';

function KeyPanel() {
    const [userInput, setUserInput] = useState('');
    const navigate = useNavigate();
    const { setConn } = useContext(ConnectionContext);
    const peer = usePeer();

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleClick = async () => {
        try {
            const sender = await peerConnectionUser(userInput);
            console.log(sender);
            if (sender?.data?.data?.senderPeerId) {
                const conn = peer.connect(sender.data.data.senderPeerId);
                setConn(conn); // Set connection context
                console.log(conn);
                if (conn) {
                    conn.on('open', () => {
                        navigate('/sharedFile');
                    });
                    conn.on('error', (err) => {
                        console.error('Connection error:', err);
                    });
                } else {
                    console.error('Error:', sender.message || "can't connect to peer");
                }
            }
        } catch (error) {
            console.error('Connection error:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <label className="block text-gray-700 text-lg font-bold mb-2" htmlFor="secretCode">
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
    );
}

export default KeyPanel;
