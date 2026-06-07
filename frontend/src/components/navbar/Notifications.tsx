import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Popover } from '@mui/material';

import { api } from '../../api';
import FriendRequestNotification from '../../features/Notifications/FriendRequestNotification';
import StreakInviteNotification from '../../features/Notifications/StreakInviteNotification';
import RoleUpdateNotification from '../../features/Notifications/RoleUpdateNotification';
import SeasonEndNotification from '../../features/Notifications/SeasonEndNotification';
import { type INotification } from '../../types/notification.types';
import './Navbar.style.css';
import './Notifications.style.css';
import Loading from '../ui/Loading';

function Notifications() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const queryClient = useQueryClient();
    const { data: notifications = [], isSuccess: notificationsQueryIsSuccess } = useQuery<INotification[]>({
        queryKey: ['notifications'],
        queryFn: async () => {
            const response = await api.get('/notifications/fetch');
            return response.data;
        },
        refetchInterval: 1000 * 10,
    });

    useEffect(() => {
        if (anchorEl) {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });    
            readNotificationsMutation.mutate();
        }
    }, [anchorEl]);

    const readNotificationsMutation = useMutation({
        mutationFn: async () => {
            return api.post('/notifications/mark-as-read');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error) => {
            console.error('Error marking notifications as read:', error);
        }
    });

    const deleteAllNotificationsMutation = useMutation({
        mutationFn: async () => {
            return api.post('/notifications/delete-all');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error) => {
            console.error('Error deleting all notifications:', error);
        }
    });

    const hasUnreadNotifications = notifications.some(notification => !notification.read);

    if (!notificationsQueryIsSuccess) {
        return <Loading />;
    }

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
                <Box className='notifications-popover-content'>
                    {notifications.length > 0 && (
                        <Box className='notifications-actions'>
                            <Button
                                className='notifications-clear-all-button'
                                onClick={() => deleteAllNotificationsMutation.mutate()}
                                disabled={deleteAllNotificationsMutation.isPending}
                                startIcon={<DeleteIcon className='notifications-clear-all-icons' />}
                                disableRipple
                            >
                                Delete all notifications
                            </Button>
                        </Box>
                    )}

                    {notifications.length === 0 ? (
                        <Box className='notifications-empty-state'>No new notifications</Box>
                    ) : (
                        <Box className='notifications-list'>
                            {notifications.map(notification => {
                                switch (notification.type) {
                                    case 'FRIEND_REQUEST':
                                        return <FriendRequestNotification key={notification.id} notification={notification} />;
                                    case 'STREAK_INVITE':
                                        return <StreakInviteNotification key={notification.id} notification={notification} />;
                                    case 'ROLE_UPDATE':
                                        return <RoleUpdateNotification key={notification.id} notification={notification} />;
                                    case 'SEASON_END':
                                        return <SeasonEndNotification key={notification.id} notification={notification} />;
                                    default:
                                        return null;
                                }
                            })}
                        </Box>
                    )}
                </Box>
            </Popover>
        </>
    );
}

export default Notifications;