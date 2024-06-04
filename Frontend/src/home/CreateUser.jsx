/* eslint-disable no-unused-vars */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../Api/index.js";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../store/UserStore.js";
import { peer } from "../peer/peer.js";

function CreateUser() {
    const navigate = useNavigate();
    const [mode, setMode] = useState("");
    const [username, setUsername] = useState("");
    const dispatch = useDispatch();

    const handleModeChange = (mode) => {
        setMode(mode);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = await createUser(username, mode, peer.id);
        if (user) {
            console.log("okk");
        }
        dispatch(userData(user));
        navigate(mode === "sender" ? "/sender" : "/receiver");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">User Information</h2>
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
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUser;
