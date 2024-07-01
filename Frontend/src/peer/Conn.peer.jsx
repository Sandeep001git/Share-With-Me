import { createContext, useState } from 'react';

const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
    const [conn, setConn] = useState(null);

    return (
        <ConnectionContext.Provider value={{ conn, setConn }}>
            {children}
        </ConnectionContext.Provider>
    );
};

export default ConnectionContext;
