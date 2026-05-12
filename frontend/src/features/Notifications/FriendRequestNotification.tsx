import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, IconButton, Typography } from '@mui/material';

import { type INotification } from '../../types/notification.types';
import './FriendRequestNotification.style.css';

import { api } from '../../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface FriendRequestNotificationProps {
    notification: INotification;
};

function FriendRequestNotification({ notification }: FriendRequestNotificationProps) {
    const queryClient = useQueryClient();
    const friendInviteMutation = useMutation({
        mutationFn: async ({ accepted, inviteId, notificationId }: { accepted: boolean, inviteId: number, notificationId: number }) => {
            return api.post(`/friends/respond?inviteId=${inviteId}&notificationId=${notificationId}&accepted=${accepted}`);
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['notifications'] }),
                queryClient.invalidateQueries({ queryKey: ['discoverAccounts'] }),
                queryClient.invalidateQueries({ queryKey: ['pendingFriendRequests'] }),
                queryClient.invalidateQueries({ queryKey: ['accountFriends'] }) 
            ]);
        },
        onError: (error) => {
            console.error('Error responding to friend request:', error);
        }
    });

    return (
        <Box key={notification.id} className='friend-request-notification'>
            <Avatar src={notification.payload.profilePictureUrl} className='friend-request-avatar'>
                {notification.payload.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box className='friend-request-content'>
                <Typography variant="body2" className='friend-request-text'>
                    <strong>{notification.payload.username}</strong> wants to connect.
                </Typography>
            </Box>
            <Box className='friend-request-actions'>
                <IconButton size="small" className='friend-request-accept' onClick={() => friendInviteMutation.mutate({ accepted: true, inviteId: notification.payload.inviteId, notificationId: notification.id })}>
                    <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" className='friend-request-decline' onClick={() => friendInviteMutation.mutate({ accepted: false, inviteId: notification.payload.inviteId, notificationId: notification.id })}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}

export default FriendRequestNotification;
