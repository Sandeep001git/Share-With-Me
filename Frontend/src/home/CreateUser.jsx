/* eslint-disable no-unused-vars */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CreateUser() {
  //reducer  here or redux
  const navigate = useNavigate();
  const [mode, setMode] = useState("");
  const handleModeChange = (mode) => {
    setMode(mode);
  };
  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(mode == "sender" ? "/sender" : "/reciver");
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">User Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
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
                }`}>
                Sender
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("receiver")}
                className={`px-4 py-2 rounded-md ${
                  mode === "receiver"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}>
                Receiver
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
