import { useState, useEffect } from 'react';
import { Box, Button, Popover } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FriendRequestNotification from '../../features/Notifications/FriendRequestNotification';
import StreakInviteNotification from '../../features/Notifications/StreakInviteNotification';
import { api } from '../../api';
import { type INotification } from '../../entities';
import './Navbar.style.css';
import './Notifications.style.css';
import { useQueryClient } from '@tanstack/react-query';

function Notifications() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const queryClient = useQueryClient();

    useEffect(() => {
        const intervalFetchNotifications = setInterval(() => {
            fetchNotifications();
        }, 10000); // Fetch every 10 seconds

        fetchNotifications(); // Initial fetch on component mount

        return () => clearInterval(intervalFetchNotifications);
    }, []);

    useEffect(() => {
        if (anchorEl) {
            fetchNotifications();
            markNotificationsAsRead();
        }
    }, [anchorEl]);

    const markNotificationsAsRead = async () => {
        try {
            const response = await api.post('/notifications/mark-as-read');
            if (response.status === 200) {
                console.log('Notifications marked as read');
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            }
        }
        catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    }

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications/fetch');
            if (response.status === 200) {
                console.log('Fetched notifications:', response.data);
                setNotifications(response.data);
            }
        }
        catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };
  
    const handleFriendRequestAction = async (accepted: boolean, inviteId: number, notificationId: number) => {
        try {
            const response = await api.post(`/friends/respond?inviteId=${inviteId}&notificationId=${notificationId}&accepted=${accepted}`);

            if (response.status === 200) {
                console.log('Friend request response sent successfully');

                setNotifications(prev => prev.filter(n => n.id !== notificationId));
            
                const meResponse = await api.get('/auth/me');
                if (meResponse.status === 200) {
                    queryClient.invalidateQueries({ queryKey: ['account'] });
                }
            }
        }
        catch (error) {
            console.error('Error responding to friend request:', error);
        }
    };

    const handleStreakInviteAction = async (accepted: boolean, inviteId: number, notificationId: number) => {
        try {
            const response = await api.post(`/streaks/respond?inviteId=${inviteId}&notificationId=${notificationId}&accepted=${accepted}`);

            if (response.status === 200) {
                console.log('Streak invite response sent successfully');

                setNotifications(prev => prev.filter(n => n.id !== notificationId));
            
                const meResponse = await api.get('/auth/me');
                if (meResponse.status === 200) {
                    queryClient.invalidateQueries({ queryKey: ['account'] });
                }
            }
        }        catch (error) {
            console.error('Error responding to streak invite:', error);
        }
    };

    const hasUnreadNotifications = notifications.some(notification => !notification.read);

    return (
        <>
            <Button 
                className='navbar-link-button'
                onClick={(event) => setAnchorEl(event.currentTarget)}
                disableRipple
            >
                {hasUnreadNotifications ? (
                    <NotificationsActiveIcon className='navbar-logo-button notifications-active-icon' />
                ) : (
                    <NotificationsIcon className='navbar-logo-button' />
                )}
            </Button>
            
            <Popover 
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                slotProps={{
                    paper: {
                        className: 'notifications-popover-paper'
                    }
                }}
            >
                {notifications.length === 0 ? (
                    <Box className='notifications-empty-state'>No new notifications</Box>
                ) : (
                    <Box className='notifications-list'>
                        {notifications.map(notification => {
                            if (notification.type === 'FRIEND_REQUEST') {
                                return <FriendRequestNotification key={notification.id} notification={notification} handleFriendRequestAction={handleFriendRequestAction} />;
                            }
                            else if (notification.type === 'STREAK_INVITE') {
                                return <StreakInviteNotification key={notification.id} notification={notification} handleStreakInviteAction={handleStreakInviteAction} />;
                            }
                            return null;
                        })}
                    </Box>
                )}
            </Popover>
        </>
    );
}

export default Notifications;