import { Peer } from "peerjs";
import { asyncHandler } from "./asyncHandler";

const conn = new Peer();
const connect = asyncHandler(async (req, res) => {
    conn.on("open", (id) => {
        return res.id;
    }).on("error", (error) => {
        return res.error;
    });
});

export { conn, connect};

