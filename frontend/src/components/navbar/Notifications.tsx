import { useState, useEffect } from 'react';
import { Box, Button, Popover } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FriendRequestNotification from '../../features/Notifications/FriendRequestNotification';
import { api } from '../../api';
import { type INotification } from '../../entities';
import './Navbar.style.css';
import './Notifications.style.css';

function Notifications() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState<INotification[]>([]);

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 60000);
        
        return () => clearInterval(interval);
    }, []);

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
            }
        }
        catch (error) {
            console.error('Error responding to friend request:', error);
        }
    };

    return (
        <>
            <Button 
                className='navbar-link-button'
                onClick={(event) => setAnchorEl(event.currentTarget)}
                disableRipple
            >
                {notifications.length === 0 ? (
                    <NotificationsIcon className='navbar-logo-button' />
                ) : (
                    <NotificationsActiveIcon className='navbar-logo-button notifications-active-icon' />
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
                            return null;
                        })}
                    </Box>
                )}
            </Popover>
        </>
    );
}

export default Notifications;