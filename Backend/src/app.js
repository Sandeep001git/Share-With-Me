import {express} from "express";
import cors from "cors"

const app=express()

app.use(cors({
    options:process.env.CORS_ORIGIN,
    credentials: true
}))

export default app