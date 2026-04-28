import { useEffect, useState } from 'react';
import {
    Box, Avatar, Typography, List, ListItem, ListItemButton, 
    ListItemAvatar, ListItemText, IconButton,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useProtectedAccount } from '../../../context/AccountContext';
import { type IAccount, type IStreak, type IStreakInvite } from '../../../entities';
import './Master.style.css';
import { getRankByLevel, getRankColor } from '../../../utils/rankUtils';
import { api } from '../../../api';

function Master({ setSelectedFriend }: { setSelectedFriend: React.Dispatch<React.SetStateAction<IAccount | null>> }) {
    const { account, setAccount } = useProtectedAccount();
    const [friendToRemove, setFriendToRemove] = useState<IAccount | null>(null);
    const [streakInvites, setStreakInvites] = useState<IStreakInvite[]>([]);
    const [activeStreaks, setActiveStreaks] = useState<IStreak[]>([]);

    useEffect(() => {
        fetchPendingStreakInvites();
        fetchActiveStreaks();
    }, []);

    const confirmDelete = (friend: IAccount, event: React.MouseEvent) => {
        event.stopPropagation();
        setFriendToRemove(friend);
    };

    const handleDeleteFriend = async () => {
        if (!friendToRemove || !account) {
            return;
        }
        
        try {
            const response = await api.post(`/friends/remove?friendId=${friendToRemove.id}`);
            if (response.status === 200) {
                setAccount({
                    ...account,
                    friends: account.friends.filter(f => f.id !== friendToRemove.id)
                });
            }
        } catch (error) {
            console.error('Error removing friend:', error);
        } finally {
            setFriendToRemove(null); 
        }
    };

    const handleInviteFriendToStreak = async (friendId: number, event: React.MouseEvent) => {
        event.stopPropagation();

        try {
            const response = await api.post(`/streaks/invite?friendId=${friendId}`);
            if (response.status === 200) {
                setStreakInvites(prev => [...prev, response.data]);
            }
        }
        catch (error) {
            console.error('Error inviting friend to streak:', error);
        }
    };

    const fetchPendingStreakInvites = async () => {
        try {
            const response = await api.get('/streaks/active-invites');
            if (response.status === 200) {
                setStreakInvites(response.data);
            }
        }
        catch (error) {
            console.error('Error fetching pending invites:', error);
        }
    }

    const fetchActiveStreaks = async () => {
        try {
            const response = await api.get('/streaks/active-streaks');
            if (response.status === 200) {
                setActiveStreaks(response.data);
            }
        }
        catch (error) {
            console.error('Error fetching active streaks:', error);
        }
    }

    const rankName = getRankByLevel(account.level);
    const rankColor = getRankColor(rankName);

    return (
        <Box className='master-container'>
            <Box className='master-header'>
                <Avatar src={account.profilePictureUrl} className='master-header-profile-picture' sx={{ borderColor: `${rankColor} !important` }}>
                    {!account.profilePictureUrl && account.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight="600" color="var(--text-primary)" lineHeight={1}>
                    {account.username}
                </Typography>
                <Typography variant="body2" color={rankColor} mt={0.5}>
                    Level {account.level} • {rankName}
                </Typography>
            </Box>

            <Box className='master-content'>
                <Box p={2} borderBottom="1px solid var(--bg-4)">
                    <Typography variant="subtitle2" fontWeight="600" color="var(--text-secondary)">
                        MY FRIENDS ({account.friends.length})
                    </Typography>
                </Box>
                
                <List disablePadding sx={{ overflowY: 'auto', flexGrow: 1 }}>
                    {account.friends.map((friend) => {
                        const isInvitePending = streakInvites.some(invite => 
                            (invite.receiver.id === friend.id || invite.sender.id === friend.id) 
                            && invite.status === 'PENDING'
                        );

                        const isInActiveStreak = streakInvites.some(invite =>
                            (invite.receiver.id === friend.id || invite.sender.id === friend.id) 
                            && invite.status === 'ACCEPTED'
                        ) || activeStreaks.some(streak => 
                            (streak.participant1.id === friend.id || streak.participant2.id === friend.id)
                        );

                        return (
                            <ListItem disablePadding key={friend.id} onClick={() => setSelectedFriend(friend)}>
                                <ListItemButton>
                                    <ListItemAvatar sx={{ minWidth: 50 }}>
                                        <Avatar 
                                            src={friend.profilePictureUrl}
                                            sx={{ width: 36, height: 36, bgcolor: "var(--bg-4)" }}
                                        >
                                            {!friend.profilePictureUrl && friend.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={friend.username} 
                                        secondary={`Level ${friend.level} • ${getRankByLevel(friend.level)}`}
                                        slotProps={{
                                            primary: {
                                                fontSize: "1rem", fontWeight: "500", color: "var(--text-primary)"
                                            },
                                            secondary: {
                                                fontSize: "0.8rem", color: "var(--text-secondary)"
                                            }
                                        }}
                                    />

                                    {!isInActiveStreak && (
                                        <Button
                                            size="small"
                                            onClick={(e) => handleInviteFriendToStreak(friend.id, e)}
                                            disabled={isInvitePending}
                                            sx={{
                                                mr: 1,
                                                backgroundColor: isInvitePending ? 'var(--bg-4)' : 'var(--accent-main)',
                                                color: isInvitePending ? 'var(--text-secondary)' : '#000',
                                                textTransform: 'none',
                                                fontWeight: '600',
                                                borderRadius: '6px',
                                                '&:hover': {
                                                    backgroundColor: isInvitePending ? 'var(--bg-4)' : 'var(--accent-hover)',
                                                },
                                                '&.Mui-disabled': {
                                                    backgroundColor: 'var(--bg-4)',
                                                    color: 'var(--text-secondary)'
                                                }
                                            }}
                                        >
                                            {isInvitePending ? 'Pending' : 'Invite'}
                                        </Button>
                                    )}

                                    <IconButton
                                        size="small"
                                        className='master-delete-friend-button'
                                        onClick={(e) => confirmDelete(friend, e)}
                                        sx={{ color: 'var(--text-secondary)', '&:hover': { color: 'var(--difficulty-hard)' } }}
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </ListItemButton>
                            </ListItem>
                        )
                    })}

                    {account.friends.length === 0 && (
                        <Typography variant="body2" color="var(--text-secondary)" textAlign="center" mt={4}>
                            No friends yet. Start connecting!
                        </Typography>
                    )}
                </List>
            </Box>

            <Dialog 
                open={Boolean(friendToRemove)} 
                onClose={() => setFriendToRemove(null)}
                slotProps={{
                    paper: {
                        sx: { backgroundColor: 'var(--bg-1)', color: 'var(--text-primary)', borderRadius: '12px' }
                    }
                }}
            >
                <DialogTitle>Remove Friend?</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: 'var(--text-secondary)' }}>
                        Are you sure you want to remove <strong>{friendToRemove?.username}</strong> from your friends list?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setFriendToRemove(null)} sx={{ color: 'var(--text-secondary)' }}>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteFriend} variant="contained" sx={{ backgroundColor: 'var(--difficulty-hard)', '&:hover': { backgroundColor: '#d32f2f' } }}>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Master;