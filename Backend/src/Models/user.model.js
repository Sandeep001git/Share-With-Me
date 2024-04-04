import mongoose, { Schema } from "mongoose";

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    mode:{
        type: String,
        required: true,
    }
});

export const User=mongoose.model("User",userSchema)

