import { Avatar, Box, Typography } from '@mui/material';

import { type INotification } from '../../types/notification.types';
import './RoleUpdateNotification.style.css';

interface IRoleUpdateNotificationProps {
    notification: INotification;
};

function RoleUpdateNotification({ notification }: IRoleUpdateNotificationProps) {
    const payload: any = notification.payload || {};
    const message = payload.message || 'Your role has been updated.';

    const avatarUrl = notification.receiver?.profilePictureUrl || '';

    return (
        <Box key={notification.id} className="role-update-notification">
            <Avatar src={avatarUrl} className="role-update-avatar">
                {notification.receiver?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box className="role-update-content">
                <Typography variant="body2" className="role-update-text">
                    {message}
                </Typography>
                <Typography variant="caption" className="role-update-timestamp">
                    {new Date(notification.timestamp).toLocaleString()}
                </Typography>
            </Box>
        </Box>
    );
}

export default RoleUpdateNotification;
