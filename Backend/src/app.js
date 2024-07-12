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
// Allow requests from specific origin
const allowedOrigins = ['https://share-with-me.vercel.app'];

// Configure CORS options
const corsOptions = {
    origin: function(origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],  // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Specify allowed headers
};

// Use CORS middleware
app.use(cors(corsOptions));

app.options('*', cors());
app.use(express.static('public'));
app.use("/api/v1/", userRouter);


export {  app };
