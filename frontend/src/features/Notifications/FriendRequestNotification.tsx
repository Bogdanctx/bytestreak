import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, IconButton, Typography } from '@mui/material';

import { type INotification } from '../../types/notification.types';
import './FriendRequestNotification.style.css';

interface FriendRequestNotificationProps {
    notification: INotification;
    handleFriendRequestAction: (accepted: boolean, inviteId: number, notificationId: number) => void;
};

function FriendRequestNotification({ notification, handleFriendRequestAction }: FriendRequestNotificationProps) {
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
                <IconButton size="small" className='friend-request-accept' onClick={() => handleFriendRequestAction(true, notification.payload.inviteId, notification.id)}>
                    <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" className='friend-request-decline' onClick={() => handleFriendRequestAction(false, notification.payload.inviteId, notification.id)}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}

export default FriendRequestNotification;