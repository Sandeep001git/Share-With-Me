/* eslint-disable react/prop-types */
// PeerContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { Peer } from 'peerjs';

const PeerContext = createContext();

export const usePeer = () => useContext(PeerContext);

export const PeerProvider = ({ children }) => {
    const [peer, setPeer] = useState(null);

    useEffect(() => {
        const storedPeerId = sessionStorage.getItem('peerId');
        let newPeer;

        const config = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'turn:0.peerjs.com:3478', username: 'peerjs', credential: 'peerjsp' }
            ],
            sdpSemantics: 'unified-plan',
        };

        if (storedPeerId) {
            newPeer = new Peer(storedPeerId, { config });
        } else {
            newPeer = new Peer({ config });
            newPeer.on('open', (id) => {
                console.log(`Peer ID: ${id}`);
                sessionStorage.setItem('peerId', id); // Store peerId in sessionStorage
            });
        }

        newPeer.on('error', (err) => {
            console.error('PeerJS Error:', err);
        });

        setPeer(newPeer);

        return () => {
            if (newPeer) {
                newPeer.destroy();
                sessionStorage.removeItem('peerId'); // Remove stored peerId when component unmounts
            }
        };
    }, []);

    return (
        <PeerContext.Provider value={peer}>
            {children}
        </PeerContext.Provider>
    );
};
