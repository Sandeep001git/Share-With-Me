import Peer  from "peer";

const Connection=()=>{
    const peer=new Peer()
    return peer
}
const peer=Connection()
// eslint-disable-next-line no-unused-vars
peer.addEventListener('connectionstatechange', e => {
    if (Connection.connectionState === 'connected') {
        return true
    }
    return false
});

export {peer}