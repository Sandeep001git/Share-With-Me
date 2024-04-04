import {Peer} from "peerjs"

const connect=async()=>{
    const conn=new Peer()
    conn.on('open',(id)=>{
        return id
    })
}





