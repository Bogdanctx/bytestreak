import { useState, useEffect } from 'react';
import { Box, Button, Popover } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FriendRequestNotification from '../../features/Notifications/FriendRequestNotification';
import StreakInviteNotification from '../../features/Notifications/StreakInviteNotification';
import { api } from '../../api';
import { type IFriendInvite, type INotification } from '../../entities';
import './Navbar.style.css';
import './Notifications.style.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function Notifications() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const queryClient = useQueryClient();
    const { data: notifications = [] } = useQuery<INotification[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const response = await api.get('/notifications/fetch');
            return response.data;
        },
        refetchInterval: 1000 * 10,
    });

    useEffect(() => {
        if (anchorEl) {
            markNotificationsAsRead();
        }
    }, [anchorEl]);

    const markNotificationsAsRead = async () => {
        try {
            const response = await api.post('/notifications/mark-as-read');
            if (response.status === 200) {
                console.log('Notifications marked as read');
                queryClient.setQueryData(['notifications'], (old: INotification[] = []) => 
                    old.map(notifications => ({ ...notifications, read: true }))
                );
            }
        }
        catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    }
  
    const handleFriendRequestAction = async (accepted: boolean, inviteId: number, notificationId: number) => {
        try {
            const response = await api.post(`/friends/respond?inviteId=${inviteId}&notificationId=${notificationId}&accepted=${accepted}`);

            if (response.status === 200) {
                queryClient.setQueryData(['notifications'], (old: INotification[] = []) => 
                    old.filter(notification => notification.id !== notificationId)
                );

                queryClient.setQueryData(['pendingConnections'], (old: IFriendInvite[] = []) => 
                    old.filter(invite => invite.id !== inviteId)
                );
                
                queryClient.setQueryData(['sentConnections'], (old: IFriendInvite[] = []) => 
                    old.filter(invite => invite.id !== inviteId)
                );
            

                queryClient.invalidateQueries({ queryKey: ['account'] });
                queryClient.invalidateQueries({ queryKey: ['discoverAccounts'] });
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
                queryClient.setQueryData(['notifications'], (old: INotification[] = []) => 
                    old.filter(notification => notification.id !== notificationId)
                );
            
                queryClient.invalidateQueries({ queryKey: ['account'] });
            }
        }        
        catch (error) {
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