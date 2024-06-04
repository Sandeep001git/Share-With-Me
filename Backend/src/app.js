import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import { ExpressPeerServer } from "peer";
import http from "http";

const app = express();
const server = http.createServer(app);
const expressPeerServer = new ExpressPeerServer(server, {
    host:"localhost",
    port:process.env.CORS_ORIGIN,
    path: "/peerjs",
    secure: false,
});

app.use(express.json());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use("/api/v1/", userRouter);
app.use("/peerjs", expressPeerServer,()=>{
    const date =new Date()
    console.log(`running ${date.toTimeString()}`)
});

const connection = new Map();

expressPeerServer.on("connection", (conn) => {
    connection.set(conn.id, conn);
    console.log(`Peer connected: ${conn.id}`);
});

expressPeerServer.on("disconnect", (conn) => {
    connection.delete(conn.id);
    console.log(`Peer disconnected: ${conn.id}`);
});

// Export the server and the peer server after initialization
export { expressPeerServer , connection , app };

