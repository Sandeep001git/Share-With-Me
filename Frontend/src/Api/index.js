import axios from "axios";

// Without axios
const createUser = async (username, mode, peerId) => {
    try {
        const request = await fetch(
            "http://localhost:8000/api/v1/peerjs/create/user",
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

        console.log(data);
        return data;
    } catch (error) {
        console.log("Error Creating User ::", error);
    }
};

const peerConnectionUser = async (key) => {
    try {
        const request = await axios.post(
            "http://localhost:8000/api/v1/connect/user",
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
