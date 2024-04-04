import {express} from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js"

const app=express()

app.use(cors({
    options:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use('/api/v1/users',userRouter)

export default app