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
        origin: "https://share-with-me.vercel.app/",
        methods: ["GET", "POST","PUT","DELETE"], // Allow only GET and POST requests
        allowedHeaders: ["Content-Type"], // Allow only specific headers
        credentials: true, // Allow including cookies in requests
    })
);

app.use("/api/v1/", userRouter);


export {  app };
