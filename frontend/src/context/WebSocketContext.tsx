import { Client } from '@stomp/stompjs';
import { useAccountContext } from "./AccountContext";
import { createContext, useContext, useEffect, useState } from 'react';

interface IWebSocketContext {
    stompClient: Client | null;
}

const WebSocketContext = createContext<IWebSocketContext>({ stompClient: null });

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { account } = useAccountContext();
    const [stompClient, setStompClient] = useState<Client | null>(null);

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

                client.subscribe(`/user/queue/messages/${account.id}`, (message) => {
                    const newLiveMessage = JSON.parse(message.body);
                });

                client.subscribe(`/user/queue/streak-invites/${account.id}`, (message) => {
                    const invite = JSON.parse(message.body);
                });
            },
            onStompError: (error) => {
                console.error('WebSocket STOMP error:', error);
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
        <WebSocketContext.Provider value={{ stompClient }}>
            {children}
        </WebSocketContext.Provider>
    );
};
