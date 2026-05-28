import { Avatar, Box, Typography } from '@mui/material';

import { type INotification, type ISeasonEndNotificationPayload } from '../../types/notification.types';
import './SeasonEndNotification.style.css';

interface ISeasonEndNotificationProps {
    notification: INotification;
};

function SeasonEndNotification({ notification }: ISeasonEndNotificationProps) {
    const payload = notification.payload as ISeasonEndNotificationPayload;
    const message = payload.message || 'The season has ended.';

    const avatarUrl = notification.receiver?.profilePictureUrl || '';

    return (
        <Box key={notification.id} className="season-end-notification">
            <Avatar src={avatarUrl} className="season-end-avatar">
                {notification.receiver?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box className="season-end-content">
                <Typography variant="body2" className="season-end-text">
                    {message}
                </Typography>
                <Typography variant="caption" className="season-end-timestamp">
                    {new Date(notification.timestamp).toLocaleString()}
                </Typography>
            </Box>
        </Box>
    );
}

export default SeasonEndNotification;