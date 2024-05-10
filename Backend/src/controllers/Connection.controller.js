import { User } from "../Models/user.sender.model.js";
import { UserReciv } from "../Models/user.reciver.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { conn, connect } from "../utils/conn.peerjs.js";
import  encryption  from "../utils/encryption.util.js";
import  decryption  from "../utils/decryption.util.js";

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

const isSenderIsConnected = () => {
    const senderConnetion = conn.on("connection", (conn) => {
        return conn;
    });
    if (senderConnetion) return true;
    else false;
};

const createUser = asyncHandler(async (req, res) => {
  
    const { username, mode } = req.query;


    if ([username, mode].some((fields) => fields?.trim == "")) {
        throw new ApiError(400, "username is required");
    }
    if (mode == "sender") {
        const secreateCode = generateKey({ username, mode });
        const senderPeerId =await connect();
        console.log(senderPeerId)
        const user = await User.create({
            username,
            mode,
            secreateCode,
            senderPeerId,
        });

        if (!user) {
            throw new ApiError(
                500,
                "Something went wrong while registring the user"
            );
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, [user, secreateCode], "user is created")
            );
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
            .json(new ApiResponse(200, UserReciv._id, "user is created"));
    }
});

const peerConnection = asyncHandler(async (req, res) => {
    //  peerjs connection
    // ->getting secreateCode
    // ->creating connection from reciver side with connection util
    // ->sending id to sender and establishing coonection
    // ->sending desired data to reciver

    const { key } = req.body;
    const val = checkKey(key);
    if (val) {
        try {
            const sender = User.findOne({ key }, { new: true });
            const senderId = sender.senderPeerId;

            const userConnet = await conn.on("connect", senderId);
            if (userConnet) {
                return (
                    res.status(200),
                    json(new ApiResponse(200, "user is connected"))
                );
            }
        } catch (error) {
            throw new ApiError(505, "cannot connect to peer server : ", error);
        }
    }
    return res.status(400), json(new ApiResponse(400, "Key is invalid"));
});

const connectionEstablisedSignalToSender = () => {};

const senderFileSharing = asyncHandler(async (req, res) => {
    const senderFile = req.files?.sendFile[0];
    const encryptionAndDecryptionPassward =
        process.env.ENCRYPTION_AND_DECRYPTION_PASSWARD;
    if (senderFile) {
        const conn = isSenderIsConnected();
        if (conn) {
            const file = encryption(
                senderFile,
                encryptionAndDecryptionPassward
            );
            conn.send(file);
        }
    }
});

const reciverDataStoreage = () => {
    const encryptionAndDecryptionPassward =
        process.env.ENCRYPTION_AND_DECRYPTION_PASSWARD;
    let receivedChunks = [];
    let totalSize = 0;
    const conn = isSenderIsConnected();

    conn.on("data", (data) => {
        if (data.type === "file") {
            totalSize = data.size;
        } else {
            receivedChunks.push(data);

            let receivedSize = receivedChunks.reduce(
                (acc, chunk) => acc + chunk.length,
                0
            );
            const file = decryption(
                receivedChunks,
                encryptionAndDecryptionPassward
            );
            if (receivedSize === totalSize) {
                const fileData = new Blob(file, {
                    type: "application/octet-stream",
                });
                const fileURL = URL.createObjectURL(fileData);

                const a = document.createElement("a");
                a.href = fileURL;
                a.download = data.name;
                document.body.appendChild(a);
                a.click();

                document.body.removeChild(a);
                URL.revokeObjectURL(fileURL);

                receivedChunks = [];
            }
        }
    });
};

const closeConnection = () => {
    conn.close();
};

export {
    createUser,
    peerConnection,
    senderFileSharing,
    reciverDataStoreage,
    closeConnection,
};
