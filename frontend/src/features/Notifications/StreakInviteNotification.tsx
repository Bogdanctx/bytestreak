import {
    Box,
    Typography,
    Avatar,
    IconButton
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { type INotification } from '../../entities';
import './StreakInviteNotification.style.css';

type StreakInviteNotificationProps = {
    notification: INotification;
    handleStreakInviteAction: (accepted: boolean, inviteId: number, notificationId: number) => void;
};

function StreakInviteNotification({ notification, handleStreakInviteAction }: StreakInviteNotificationProps) {
    return (
        <Box key={notification.id} className='streak-invite-notification'>
            <Avatar src={notification.payload.profilePictureUrl} className='streak-invite-avatar'>
                {notification.payload.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box className='streak-invite-content'>
                <Typography variant="body2" className='streak-invite-text'>
                    <strong>{notification.payload.username}</strong> has invited you to a streak!
                </Typography>
            </Box>
            <Box className='streak-invite-actions'>
                <IconButton size="small" className='streak-invite-accept' onClick={() => handleStreakInviteAction(true, notification.payload.inviteId, notification.id)}>
                    <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" className='streak-invite-decline' onClick={() => handleStreakInviteAction(false, notification.payload.inviteId, notification.id)}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}

export default StreakInviteNotification;