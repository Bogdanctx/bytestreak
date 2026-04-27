import {
    Box,
    Typography,
    Avatar,
    IconButton
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { type INotification } from '../../entities';
import './FriendRequestNotification.style.css';
import { api } from '../../api';

function FriendRequestNotification({ notification }: { notification: INotification }) {
    
    const handleFriendRequestAction = async (accepted: boolean, inviteId: number) => {
        try {
            const response = await api.post(`/friends/respond?requestId=${inviteId}&accepted=${accepted}`);

            if (response.status === 200) {
                console.log('Friend request response sent successfully');
            }
        }
        catch (error) {
            console.error('Error responding to friend request:', error);
        }
    };

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
                <IconButton size="small" className='friend-request-accept' onClick={() => handleFriendRequestAction(true, notification.payload.inviteId)}>
                    <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" className='friend-request-decline' onClick={() => handleFriendRequestAction(false, notification.payload.inviteId)}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}

export default FriendRequestNotification;