import { User } from "../Models/user.sender.model.js";
import {UserReciv} from "../Models/user.reciver.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import conn,{ connect } from "../utils/conn.peerjs.js";

const generateKey = ({ ...user }) => {
    //user.model -> name ,_id , mode
    let user_arr = `${user.id}${user.username}${user.mode}`;
    let codeGenratingString =
        "ABCDEFGHIJKLMNOQPRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-*!@#$%^&*_123456789";
    let random_string = "";
    for (let i = 0; i < 25; i++) {
        let randomInt = Math.floor(Math.random() * codeGenratingString.length);
        random_string +=
            user_arr[Math.floor(Math.random() * user_arr.length)] +
            codeGenratingString[randomInt];
    }
    return random_string;
};

const checkKey = async (key) => {
    const dbCode = await User.findOne({ secreateCode });
    if (dbCode == key) {
        return true;
    } else {
        return false;
    }
};
const createUser = asyncHandler(async (req, res) => {
    const { username, mode } = req.body;

    if ([username, mode].some((fields) => fields?.trim == "")) {
        throw new ApiError(400, "username is required");
    }
    if (mode == "sender") {
        const secreateCode = generateKey({ username, mode });
        const senderPeerId=connect()
        const user = await User.create({
            username,
            mode,
            secreateCode,
            senderPeerId
        });

        if (!user) {
            throw new ApiError(
                500,
                "Something went wrong while registring the user"
            );
        }
        return res
            .status(200)
            .json(new ApiResponse(200, user, secreateCode, "user is created"));
    } else {

        const user = await UserReciv.create({
            username,
            mode,
        });

        if (user) {
            throw new ApiError(
                500,
                "Something went wrong while registring the user"
            );
        }
        return res
            .status(200)
            .json(new ApiResponse(200, user, secreateCode, "user is created"));
    }
});

const peerConnection = asyncHandler(async (req, res) => {
    //  peerjs connection
    // ->getting secreateCode
    // ->creating connection from reciver side with connection util
    // ->sending id to sender and establishing coonection
    // ->sending desired data to reciver

    const { key } = req.body;
        const val=checkKey(key)
        if(val){
            try {
                
                const sender=User.findOne({key},{new:true})
                const senderId=sender[senderPeerId]
                
                conn.on('connect',senderId)
                
            } catch (error) {
                throw new ApiError(505,"cannot connect to peer server : ",error)
            }
        }
        return res.status(400),
        json(new ApiResponse(400,'Key is invalid'))
});

export { createUser, peerConnection };
