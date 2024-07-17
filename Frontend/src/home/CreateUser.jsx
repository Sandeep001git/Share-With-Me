import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../Api/index.js";
import { useDispatch } from "react-redux";
import { userData, removeUser } from "../store/UserStore.js";
import { usePeerContext } from "../peer/Peer.jsx";
import ErrorPage from "./ErrorPage.jsx";
import Peer from "peerjs";
import { useAppContext } from "../peer/Page.context.jsx";
import { useSelector } from "react-redux";
import logoImage from "../assets/logo.png";

function CreateUser() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("");
    const [username, setUsername] = useState("");
    const dispatch = useDispatch();
    const user = useSelector((state) => state.User);
    const { peer, setPeer } = usePeerContext();
    const [error, setError] = useState(null);
    const { isFirstLoad, resetApp } = useAppContext();

    useEffect(() => {
        if (isFirstLoad) {
            resetApp();
        } else if (!isFirstLoad && (!peer || !peer.id)) {
            const initializePeer = async () => {
                try {
                    dispatch(removeUser(user[0].data));
                    const newPeer = new Peer();
                    newPeer.on("open", (id) => {
                        console.log(`Peer ID: ${id}`);
                        sessionStorage.setItem("peerId", id);
                    });
                    newPeer.on("error", () => {
                        setError("PeerJS Error:");
                    });
                    setPeer(newPeer);
                } catch (error) {
                    setError({
                        status: 500,
                        message: "Error initializing Peer",
                    });
                }
            };

            initializePeer();
        }
    }, [isFirstLoad, peer?.id, setPeer, resetApp]);

    const handleModeChange = (mode) => {
        setMode(mode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await createUser(username, mode, peer.id);
            if (response.success) {
                const storeUser = JSON.stringify(response);
                window.localStorage.setItem("user", storeUser);
                dispatch(userData(response.data));
                navigate(mode === "sender" ? "/sender" : "/receiver");
            } else {
                setError({ status: response.status, message: response.message });
            }
        } catch (error) {
            setError({ status: 500, message: error?.response?.data?.message });
        }
    };

    if (error) {
        return <ErrorPage error={error} />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="flex-grow flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <img src={logoImage} alt="ShareWithMe" className="mx-auto mb-4"/>
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold">User Information</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <span className="block text-sm font-medium text-gray-700 mb-2">
                                Mode
                            </span>
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => handleModeChange("sender")}
                                    className={`px-4 py-2 rounded-md ${
                                        mode === "sender"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    Sender
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleModeChange("receiver")}
                                    className={`px-4 py-2 rounded-md ${
                                        mode === "receiver"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    Receiver
                                </button>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <footer className="text-sm text-center p-4 bg-gray-200">
                <a
                    target="_blank"
                    href="https://icons8.com/icon/cwFcT66k30rn/data-transfer-and-syncing-arrows-logotype-isolated-on-a-white-background"
                >
                    Data transfer and syncing arrows Logotype isolated on a
                    white background
                </a>{" "}
                icon by{" "}
                <a target="_blank" href="https://icons8.com">
                    Icons8
                </a>
            </footer>
        </div>
    );
}

export default CreateUser;
