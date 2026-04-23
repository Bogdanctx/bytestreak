import { useState, useEffect } from 'react';
import { Box, Button, Popover } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { api } from '../../api';
import { type INotification } from '../../entities';
import './Navbar.style.css';
import './Notifications.style.css';
import FriendRequestNotification from '../../features/Notifications/FriendRequestNotification';

function Notifications() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notifications, setNotifications] = useState<INotification[]>([]);

    const fetchNotifications = async () => {
        api.get('/notifications')
            .then(response => {
                if (response.status === 200) {
                    console.log('Fetched notifications:', response.data);
                    setNotifications(response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    };

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 60000);
        
        return () => clearInterval(interval);
    }, []);

    const friendRequestActionHandler = async (accepted: boolean, requestId: number) => {
        api.post(`/friends/${accepted ? 'accept' : 'decline'}?requestId=${requestId}`)
            .then(response => {
                if (response.status === 200) {
                    console.log(`Friend request ${accepted ? 'accepted' : 'declined'} successfully.`);
                    setNotifications(prev => prev.filter(notification => notification.id !== requestId));
                }
            })
            .catch(error => {
                console.error(`Error ${accepted ? 'accepting' : 'declining'} friend request:`, error);
            });
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
                                return <FriendRequestNotification key={notification.id} notification={notification} actionHandler={friendRequestActionHandler} />;
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