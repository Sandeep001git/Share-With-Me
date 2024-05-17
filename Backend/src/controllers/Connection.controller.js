import { User } from "../Models/user.sender.model.js";
import { UserReciv } from "../Models/user.reciver.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { connection } from "../utils/conn.peerjs.js";
import encryption from "../utils/encryption.util.js";
import decryption from "../utils/decryption.util.js";

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
    const dbCode = await User.findOne({ key });
    if (dbCode) {
        return true;
    } else {
        return false;
    }
};

const isSenderIsConnected = (senderId) => {
    return connection.has(senderId);
};

const createUser = asyncHandler(async (req, res) => {
    const { username, mode } = req.body;

    if ([username, mode].some((fields) => fields?.trim == "")) {
        throw new ApiError(400, "username is required");
    }
    if (mode == "sender") {
        const secreateCode = generateKey({ username, mode });
        const senderPeerId = 1516521131354363;
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
            .json(new ApiResponse(200, [user], "user is created"));
    } else {
        const user = await UserReciv.create({
            username,
            mode,
        });

        if (!user) {
            throw new ApiError(
                500,
                "Something went wrong while registring the user"
            );
        }
        return res
            .status(200)
            .json(new ApiResponse(200, user._id, "user is created"));
    }
});

const peerConnection = asyncHandler(async (req, res) => {

    const { key } = req.body;
    const val = checkKey(key);
    if (!val) {
        return res.status(400).json(new ApiError(400, "Key is invalid"));
    }
    try {
        const sender = await User.findOne({ secreateCode: key }, { new: true });
        if (sender !== null) {
            return res.status(200).json(
                new ApiResponse('200',sender,'sender data retrived succesfully')
            )
        } else {
            return res.status(404).json(new ApiError(404, "Sender not found"));
        }
    } catch (error) {
        throw new ApiError(505, "cannot connect to peer server : ", error);
    }
});

const senderFileSharing = asyncHandler(async (req, res) => {
    try {
        const senderFile = req.files?.sendFile?.[0];
        const {senderId} = req.body
        const encryptionAndDecryptionPassword =
            process.env.ENCRYPTION_AND_DECRYPTION_PASSWARD;
        if (!senderFile) {
            return res.status(400).json(new ApiError(400, "No file provided"));
        }
        if (!encryptionAndDecryptionPassword) {
            return res
                .status(500)
                .json(new ApiError(500, "Encryption password not found"));
        }
        const conn = isSenderIsConnected(senderId);
        if (!conn) {
            return res
                .status(500)
                .json(new ApiError(500, "Sender is not connected"));
        }

        const encryptedFile = encryption(
            senderFile,
            encryptionAndDecryptionPassword
        );
        const peer = connection.get(senderId)
        peer.send(encryptedFile);
        return res
            .status(200)
            .json(new ApiResponse(200, "File sent successfully"));
    } catch (error) {
        return res
            .status(500)
            .json(new ApiError(500, "Error sending file", error));
    }
});


//bellow this lisne  function while be shift to front end
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
//to this line

export {
    createUser,
    peerConnection,
    senderFileSharing,
    reciverDataStoreage,
    closeConnection,
};
