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

type FriendRequestNotificationProps = {
    notification: INotification;
    actionHandler: (accepted: boolean, requestId: number) => void;
};

function FriendRequestNotification({ notification, actionHandler }: FriendRequestNotificationProps) {
    return (
        <Box key={notification.id} className='friend-request-notification'>
            <Avatar src={notification.sender.profilePictureUrl} className='friend-request-avatar'>
                {notification.sender.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box className='friend-request-content'>
                <Typography variant="body2" className='friend-request-text'>
                    <strong>{notification.sender.username}</strong> wants to connect.
                </Typography>
            </Box>
            <Box className='friend-request-actions'>
                <IconButton size="small" className='friend-request-accept' onClick={() => actionHandler(true, notification.id)}>
                    <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" className='friend-request-decline' onClick={() => actionHandler(false, notification.id)}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}

export default FriendRequestNotification;