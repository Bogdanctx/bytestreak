import { Avatar, Box, Button, Typography } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import './ProfileHeader.style.css';
import type { IAccount } from '../../../types/account.types';
import type { IUserProfile } from '../../../types/userProfile.types';
import { getLevel, getRank, getRankColor } from '../../../utils/rankUtils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import { type IFriendInvite } from '../../../types/invite.types';
import { type IFriendship } from '../../../types/friendship.types';
import Loading from '../../../components/ui/Loading';

interface IProfileHeaderProps {
    target: IUserProfile;
    myAccount: IAccount;
    setMessageChatOpen: (open: boolean) => void;
    setFriendToRemove: (account: IAccount) => void;
    friendList: IAccount[];
}

function ProfileHeader({ target, myAccount, setMessageChatOpen, setFriendToRemove, friendList }: IProfileHeaderProps) {
    const level = getLevel(target.account.currentXP);
    const rank = getRank(level);
    const rankColor = getRankColor(rank);
    const isMyProfile = myAccount?.id === target.account.id;
    const isFriend = friendList.some(friend => friend.id === myAccount?.id);
    const queryClient = useQueryClient();
    const { data: pendingConnections = [] } = useQuery<IFriendInvite[]>({
        queryKey: ['pendingConnections'],
        queryFn: async () => {
            const response = await api.get('/friends/invites/pending-connections');
            return response.data;
        }
    });
    const { data: friendship, isSuccess: friendshipQueryIsSuccess, isEnabled: friendshipQueryIsEnabled } = useQuery<IFriendship>({
        queryKey: ['friendship', target.account.id],
        queryFn: async () => {
            const response = await api.get(`/friends/get-friendship?accountId1=${target.account.id}&accountId2=${myAccount.id}`);
            return response.data;
        },
        enabled: !isMyProfile && isFriend
    })

    const addFriendMutation = useMutation({
        mutationFn: async (accountId: number) => {
            const response = await api.post(`/friends/send-request?friendId=${accountId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingConnections'] });
            notify('Friend invite sent successfully!', 'success');
        },
        onError: (error) => {
            console.error('Error sending friend invite:', error);
            notify('Failed to send friend invite. Please try again.', 'error');
        }
    });

    if (!friendshipQueryIsSuccess && friendshipQueryIsEnabled) {
        return <Loading />;
    }

    return (
        <Box className="profile-header">
            <Box className="profile-header-content">
                <Avatar
                    src={target.account.profilePictureUrl}
                    alt={target.account.username}
                    className="profile-avatar"
                    sx={{ borderColor: rankColor }}
                >
                    {target.account.username.charAt(0).toUpperCase()}
                </Avatar>

                <Box className="profile-header-info">
                    <Typography className="profile-username" variant="h4">
                        {target.account.username}
                    </Typography>
                    <Box className="profile-rank-container">
                        <Typography className="profile-rank" variant="body2" sx={{ color: rankColor }}>
                            {rank.toUpperCase()}
                        </Typography>
                        <Typography className="profile-level" variant="body2">
                            Level {level}
                        </Typography>
                    </Box>
                    {target.account.bio && (
                        <Typography className="profile-bio" variant="body2">
                            {target.account.bio}
                        </Typography>
                    )}
                </Box>

                <Box className="profile-meta">
                    <Typography className="profile-meta-item">
                        Leaderboard #7 
                    </Typography>
                    <Typography className="profile-meta-item">
                        Joined on {new Date(target.account.joinedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                    {isFriend && (
                        <Typography className="profile-meta-item">
                            Friends since {new Date(friendship.friendsSince).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Action Buttons */}
            <Box className="profile-actions">
                {!isMyProfile && isFriend && (
                    <>
                        <Button
                            variant="contained"
                            startIcon={<MessageIcon />}
                            onClick={() => setMessageChatOpen(true)}
                            sx={{
                                backgroundColor: 'var(--accent-main)',
                                '&:hover': { backgroundColor: 'var(--accent-hover)' }
                            }}
                        >
                            Send Message
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => setFriendToRemove(target.account)}
                            sx={{
                                borderColor: 'var(--difficulty-hard)',
                                color: 'var(--difficulty-hard)',
                                '&:hover': { 
                                    borderColor: '#ff6b6b',
                                    backgroundColor: 'rgba(255, 107, 107, 0.1)'
                                }
                            }}
                        >
                            Remove Friend
                        </Button>
                    </>
                )}
                {!isMyProfile && !isFriend && !pendingConnections.some(invite => invite.receiver.id === target.account.id) && (
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => addFriendMutation.mutate(target.account.id)}
                        sx={{
                            backgroundColor: 'var(--accent-main)',
                            '&:hover': { backgroundColor: 'var(--accent-hover)' }
                        }}
                    >
                        Add Friend
                    </Button>
                )}
                {!isMyProfile && !isFriend && pendingConnections.some(invite => invite.receiver.id === target.account.id) && (
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        Pending Connection
                    </Typography>
                )}
            </Box>
        </Box>
    )
}

export default ProfileHeader;
