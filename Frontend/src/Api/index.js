import axios from "axios";

// Without axios
const createUser = async (username, mode, peerId) => {
    try {
        const response = await axios.post(
            "https://share-with-me-server.vercel.app/api/v1/peerjs/create/user",
            { username, mode, peerId },
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        // Handle response data
        return response.data;
    } catch (error) {
        console.error("Error Creating User:", error);
        // Optionally, throw an error or handle it in another way
        throw error;
    }
};

const peerConnectionUser = async (key) => {
    try {
        const request = await axios.post(
            "https://share-with-me-server.vercel.app/api/v1/connect/user",
            {
                key,
            }
        );
        return request;
    } catch (error) {
        console.log(error.response);
    }
};

export { createUser, peerConnectionUser };
