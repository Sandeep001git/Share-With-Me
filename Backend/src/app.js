import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import { ExpressPeerServer } from "peer";
import bodyParser from "body-parser";
import http, { Server } from "http";
import { on } from "events";

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(
    cors({
        origin: ["https://share-with-me.vercel.app", "https://share-with-me-server.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Accept", "Origin"],
        credentials: true,
    })
);
app.options('*', cors());
app.use(express.static('public'));
app.use("/api/v1/", userRouter);


export {  app };
