import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connect = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`
            );
            
        console.log( 
            "\n MONGODB Connected || DB host",
            connectionInstance.connection.host
        );
    } catch (error) {
        console.log("Mongoose connection Error", error);
        process.exit(1);
    }
};

export default connect;
