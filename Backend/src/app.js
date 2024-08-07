import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import bodyParser from "body-parser";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(helmet());
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const allowedOrigins = ['https://share-with-me.vercel.app', 'http://localhost:5173'];

// Configure CORS options
const corsOptions = {
    origin: function (origin, callback) {
        console.log('Origin received:', origin); // Log the received origin
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            console.log('Origin allowed:', origin);
            callback(null, true);
        } else {
            console.log('Origin not allowed:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Serve static files
app.use(express.static('public'));

// API routes
app.use("/api/v1/", userRouter);

// Logging
app.use(morgan('combined'));

export { app };
