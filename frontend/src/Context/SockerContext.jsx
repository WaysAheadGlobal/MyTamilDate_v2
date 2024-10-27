import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import io from "socket.io-client";
import { useCookies } from '../hooks/useCookies';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    return context;
}

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const cookies = useCookies();

    useEffect(() => {
        if (!cookies.getCookie('token')) {
            return;
        }

        const socket = io(process.env.REACT_APP_SOCKET_URL, {
            auth: {
                token: cookies.getCookie('token')
            },
        });
        setSocket(socket);

        return () => {
            socket.disconnect();
        }
    }, [window.location.pathname]);

    const value = useMemo(() => ({ socket }), [socket]);

    return (
        <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
    )
}