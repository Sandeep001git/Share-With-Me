import { expressPeerServer } from "../app.js";

const connection = new Map();

expressPeerServer.on("connection", (conn)=>{
    connection.set(conn.id,conn)
    console.log(`Peer connected: ${conn.id}`);
})

peerServer.on('disconnect', (conn) => {
    connection.delete(conn.id);
    console.log(`Peer disconnected: ${conn.id}`);
});

export { connection };
