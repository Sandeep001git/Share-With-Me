import { Peer } from "peerjs";

const connections = {};

const Connection = () => {
    const peer = new Peer(
        `${Math.floor(Math.random() * 2 ** 18)
            .toString(36)
            .padStart(4, 0)}`,
        {
            host: "localhost",
            port: 8000,
            path: "/",
        }
    );
    peer.on("open", () => {
        console.log(`Peer ID: ${peer.id}`);
    });

    peer.on("connection", (conn) => {
        conn.on("open", () => {
            console.log("Connection established with", conn.peer);
            connections[conn.peer] = conn; // Store the connection
            console.log(connections)
        });
        conn.on("close", () => {
            console.log("Connection closed with", conn.peer);
            delete connections[conn.peer]; // Remove the connection when closed
        });

        conn.on("error", (err) => {
            console.error("Connection error:", err);
            delete connections[conn.peer]; // Remove the connection on error
        });

        return peer;
    });
};
const sendFile = (file) => {
    const conn = peer.connect(connections.id);
    conn.send(file);
};
const peer = Connection();
export { peer, sendFile };
