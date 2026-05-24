import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, IconButton, Typography } from '@mui/material';

import { type INotification } from '../../types/notification.types';
import './StreakInviteNotification.style.css';

import { api } from '../../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AccountAvatar from '../../components/ui/AccountAvatar';

interface StreakInviteNotificationProps {
    notification: INotification;
}

function StreakInviteNotification({ notification }: StreakInviteNotificationProps) {
    const queryClient = useQueryClient();
    const streakInviteMutation = useMutation({
        mutationFn: async ({ accepted, inviteId, notificationId }: { accepted: boolean, inviteId: number, notificationId: number }) => {
            return api.post(`/streaks/respond?inviteId=${inviteId}&notificationId=${notificationId}&accepted=${accepted}`);
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['notifications'] }),
                queryClient.invalidateQueries({ queryKey: ['accountFriends'] }),
                queryClient.invalidateQueries({ queryKey: ['activeStreaks'] })
            ]);
        },
        onError: (error) => {
            console.error('Error responding to streak invite:', error);
        }
    });

    return (
        <Box key={notification.id} className='streak-invite-notification'>
            <AccountAvatar avatarUrl={notification.payload.profilePictureUrl} cssEffectStyle={notification.payload.cssEffectStyle} width={40} height={40} />

            <Box className='streak-invite-content'>
                <Typography variant="body2" className='streak-invite-text'>
                    <strong>{notification.payload.username}</strong> has invited you to a streak!
                </Typography>
                <Typography variant="caption" className="streak-invite-timestamp">
                    {new Date(notification.timestamp).toLocaleString()}
                </Typography>
            </Box>
            <Box className='streak-invite-actions'>
                <IconButton size="small" className='streak-invite-accept' onClick={() => streakInviteMutation.mutate({ accepted: true, inviteId: notification.payload.inviteId, notificationId: notification.id })}>
                    <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" className='streak-invite-decline' onClick={() => streakInviteMutation.mutate({ accepted: false, inviteId: notification.payload.inviteId, notificationId: notification.id })}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}

export default StreakInviteNotification;