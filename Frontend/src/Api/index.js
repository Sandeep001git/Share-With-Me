import axios from "axios";

// Without axios
const createUser = async (username, mode, peerId) => {
    try {
        const request = await fetch(
            "https://share-with-me-server.vercel.app/api/v1/peerjs/create/user",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ username, mode, peerId }),
            }
        );

        const data = await request.json(); //this line while work after reponse request is done || 200

        return data;
    } catch (error) {
        console.log("Error Creating User ::", error);
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
