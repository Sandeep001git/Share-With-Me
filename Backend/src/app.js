import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import { ExpressPeerServer } from "peer";
import http from "http";
import { on } from "events";

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "*", // Allow requests from all origins (replace with specific origins if needed)
        methods: ["GET", "POST"], // Allow only GET and POST requests
        allowedHeaders: ["Content-Type"], // Allow only specific headers
        credentials: true, // Allow including cookies in requests
    })
);

app.use("/api/v1/", userRouter);

const server = http.createServer(app);
const expressPeerServer = new ExpressPeerServer(server, {
    allow_discovery: true,
    debug: true,
});

app.use("/peerjs", expressPeerServer);

const onConnection = (data) => {
    console.info(`Client connected with id: ${data.id}`);
};

const onDisconnect = (data) => {
    console.info(`Client disconnected with id: ${data.id}`);
};

expressPeerServer.on("connection", onConnection);
expressPeerServer.on("disconnect", onDisconnect);

export { expressPeerServer, server };
