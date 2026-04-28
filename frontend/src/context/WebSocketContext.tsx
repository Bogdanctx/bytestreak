import { Client } from '@stomp/stompjs';
import { useAccountContext } from "./AccountContext";
import { createContext, useContext, useEffect, useState } from 'react';

interface IWebSocketContext {
    stompClient: Client | null;
    connected: boolean;
}

const WebSocketContext = createContext<IWebSocketContext>({ stompClient: null, connected: false });

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { account } = useAccountContext();
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!account) {
            return;
        }

        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket connected');
                setConnected(true);
            },
            onDisconnect: () => {
                console.log('WebSocket disconnected');
                setConnected(false);
            },
            onStompError: (error) => {
                console.error('WebSocket STOMP error:', error);
                setConnected(false);
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [account]);

    return (
        <WebSocketContext.Provider value={{ stompClient, connected }}>
            {children}
        </WebSocketContext.Provider>
    );
};
