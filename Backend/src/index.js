import {app} from "./app.js"
import connect from "./db/index.js"
import dotenv from "dotenv"

dotenv.config({
    path:'./.env'
})


connect()  // when a async function runs it retuns a promise
.then(()=>{
    app.on("error",(error)=>{
        console.log(`Server connetion Error connecting with DB : ${error}`)
    })
})
.then(()=>{
    app.listen(process.env.PORT || 8080,()=>{
        console.log(`⚙️  Server is running on ${process.env.PORT} Port`)
        return `<h1>surver is running </h1>`
    })
})
.catch((err)=>console.log(err))