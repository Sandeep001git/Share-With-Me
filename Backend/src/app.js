import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import { ExpressPeerServer } from "peer";
import http from "http";

const app = express();
const server = http.createServer(app);
const expressPeerServer = new ExpressPeerServer(server, {
    path: "/",
});
app.use(express.json())
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use("/api/v1/", expressPeerServer ,userRouter);

export  { expressPeerServer , app };
