import  PeerServer   from "peerjs";
import {asyncHandler}  from "./asyncHandler.js";
const conn =new PeerServer.Peer ({
    host: "0.peerjs.com",
    port: 443,
    path: "/",
    pingInterval: 5000,
});

const connect = asyncHandler(async (req, res) => {
    conn.on("open", (id) => {
        return res.id;
    }).on("error", (error) => {
        return res.error
    });
});

export {conn, connect};

