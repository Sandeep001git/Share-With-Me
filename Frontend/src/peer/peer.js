import { Peer } from "peerjs";

const connections = {};

const createPeer = () => {
    const peer = new Peer(
        `${Math.floor(Math.random() * 2 ** 18).toString(36).padStart(4, 0)}`,
        {
            host: "localhost",
            port: import.meta.env.VITE_PEER_PORT,
            path: "/peerjs",
            config: {
                'iceServers': [
                  { url: 'stun:stun.l.google.com:19302' },
                  { url: 'stun:stun1.l.google.com:19302' },
                  { url: 'stun:stun2.l.google.com:19302' },
                  { url: 'stun:stun3.l.google.com:19302' },
                  { url: 'stun:stun4.l.google.com:19302' },
                  { url: 'stun:stun.ekiga.net' },
                  { url: 'stun:stun.ideasip.com' },
                  { url: 'stun:stun.sipgate.net' },
                  { url: 'stun:stun.stunprotocol.org:3478' },
                  { url: 'stun:stun.voiparound.com' },
                  {
                    url: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                  }
                ]
              },
              debug: 3
        }
    );

    peer.on("open", () => {
        console.log(`Peer ID: ${peer.id}`);
    });

    peer.on("connection", (conn) => {
        conn.on("open", () => {
            console.log("Connection established with", conn.peer);
            connections[conn.peer] = conn; // Store the connection
            console.log(connections);
        });

        conn.on("close", () => {
            console.log("Connection closed with", conn.peer);
            delete connections[conn.peer]; // Remove the connection when closed
        });

        conn.on("error", (err) => {
            console.error("Connection error:", err);
            delete connections[conn.peer]; // Remove the connection on error
        });
    });

    return peer;
};
const peer = createPeer();
const sendFile = (file) => {
    const conn = peer.connect(connections.peer);
    conn.send(file);
};

export { peer, sendFile, connections };
