import type { T_Notification } from '../../types/index.tsx';
import { useState, useEffect } from 'react';
import Notification from './Notification.tsx';

// Function to enqueue a notification
export const notify = (notification: T_Notification) => {
    window.dispatchEvent(
        new CustomEvent('enqueue-notification', { 
            detail: { 
                message: notification.message,
                type: notification.type,
            } 
        })
    );
};

const NotificationsQueue = () => {
    const [queue, setQueue] = useState<T_Notification[]>([]);

    // Listen for enqueue events
    useEffect(() => {
        const handleEnqueue = (event: CustomEvent) => {
            setQueue(prev => [...prev, event.detail]);
        };

        window.addEventListener('enqueue-notification', handleEnqueue as EventListener);
        return () => window.removeEventListener('enqueue-notification', handleEnqueue as EventListener);
    }, []);


    // remove notification after 3 seconds
    useEffect(() => {
        if (queue.length > 0) {
            const timer = setTimeout(() => {
                setQueue(prev => prev.slice(1));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [queue]);


    return (
        <>
            {queue.map((note) => (
                <Notification 
                    key={Date.now() + Math.random()}
                    message={note.message} 
                    type={note.type} 
                />
            ))}
        </>
    );
};

export default NotificationsQueue;