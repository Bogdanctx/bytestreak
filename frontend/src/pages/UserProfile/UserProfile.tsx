import { useState } from 'react';
import { Box, Tab, Tabs, Typography, List, ListItem, ListItemButton, Divider, Button, Tooltip, IconButton, Dialog, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

import { api } from '../../api';
import { useAccount } from '../../hooks/useAccount';
import Loading from '../../components/ui/Loading';
import notify from '../../components/ui/ToastNotification';
import ProfileHeader from '../../features/UserProfile/ProfileHeader/ProfileHeader';
import ChatDialog from '../../features/UserProfile/ChatDialog/ChatDialog';
import type { IUserProfile } from '../../types/userProfile.types';
import type { IAccount } from '../../types/account.types';
import './UserProfile.style.css';
import AccountAvatar from '../../components/ui/AccountAvatar';

function UserProfile() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: currentAccount, isSuccess: currentAccountQuerySuccess } = useAccount();

    const [activeTab, setActiveTab] = useState(0);
    const [messageChatOpen, setMessageChatOpen] = useState(false);
    const [friendToRemove, setFriendToRemove] = useState<IAccount | null>(null);

    const { data: userData, isSuccess: userDataQuerySuccess } = useQuery<IUserProfile>({
        queryKey: ['userProfile', username],
        queryFn: async () => {
            const response = await api.get(`/accounts/profile/${username}`);
            return response.data;
        },
        enabled: !!username,
    });

    const { data: accountFriends = [] } = useQuery<IAccount[]>({
        queryKey: ['accountFriends', userData?.account.id],
        queryFn: async () => {
            if (!userData) {
                return [];
            }

            const response = await api.get(`/friends/get-friends?accountId=${userData.account.id}`);
            return response.data;
        },
        enabled: !!userData?.account.id,
    });

    const removeFriendMutation = useMutation({
        mutationFn: async (friendId: number) => api.delete(`/friends?friendId=${friendId}`),
        onSuccess: () => {
            setFriendToRemove(null);
    
            queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
            queryClient.invalidateQueries({ queryKey: ['accountFriends', userData?.account.id] });
    
            notify("Friend removed successfully.", "success");
        }
    });

    const removeStreakMutation = useMutation({
        mutationFn: async (streakId: number) => api.delete(`/streaks/delete-streak?streakId=${streakId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
            notify("Streak removed.", "success");
        }
    });

    if (!userDataQuerySuccess || !currentAccountQuerySuccess) {
        return <Loading />;
    }

    const userStreaks = userData.streaks.filter(s => s.participant1.id === userData.account.id || s.participant2.id === userData.account.id);

    const getActivityClass = (count: number) => {
        if (count === 0) return 'activity-day';
        if (count < 7) return 'activity-day activity-level-1';
        if (count < 14) return 'activity-day activity-level-2';
        if (count < 30) return 'activity-day activity-level-3';
        return 'activity-day activity-level-4';
    };

    return (
        <Box className="user-profile-container">
            <ProfileHeader 
                target={userData} 
                myAccount={currentAccount!} 
                setMessageChatOpen={setMessageChatOpen} 
                setFriendToRemove={setFriendToRemove}
                friendList={accountFriends}
            />

            <Box className="profile-tabs-container">
                <Tabs value={activeTab} onChange={(_, nv) => setActiveTab(nv)} className="profile-tabs" sx={{ borderBottom: '1px solid var(--bg-3)' }}>
                    <Tab label={`Friends (${accountFriends.length})`} sx={{ color: 'var(--text-secondary)', '&.Mui-selected': { color: 'var(--text-primary)' } }} />
                    <Tab label={`Streaks (${userStreaks.length})`} sx={{ color: 'var(--text-secondary)', '&.Mui-selected': { color: 'var(--text-primary)' } }} />
                    <Tab label="Activity" sx={{ color: 'var(--text-secondary)', '&.Mui-selected': { color: 'var(--text-primary)' } }} />
                </Tabs>

                {/* Friends tab */}
                {activeTab === 0 && (
                    <Box className="profile-tab-content">
                        {accountFriends.length > 0 ? (
                            <List className="friends-list">
                                {accountFriends.map((friend) => (
                                    <Box key={friend.id}>
                                        <ListItem className="friend-item" disablePadding>
                                            <ListItemButton onClick={() => navigate(`/accounts/profile/${friend.username}`)} className="friend-button">
                                                <Box mr={1}>
                                                    <AccountAvatar avatarUrl={friend.profilePictureUrl} cssEffectStyle={friend.cssEffectStyle} width={40} height={40} />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>{friend.username}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>{friend.solvedProblems.length} problems solved</Typography>
                                                </Box>
                                                {currentAccount.id !== friend.id && (
                                                    <Button size="small" 
                                                            variant="outlined" 
                                                            onClick={(event) => { 
                                                                event.stopPropagation(); 
                                                                setFriendToRemove(friend); 
                                                            }} 
                                                            color="error"
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider sx={{ borderColor: 'var(--bg-3)' }} />
                                    </Box>
                                ))}
                            </List>
                        ) : <Typography className="empty-state" variant="body2">No friends yet.</Typography>}
                    </Box>
                )}

                {/* Streaks tab */}
                {activeTab === 1 && (
                    <Box className="profile-tab-content">
                        {userStreaks.length > 0 ? (
                            <List className="streaks-list">
                                {userStreaks.map((streak) => {
                                    const otherParticipant = streak.participant1.id === userData.account.id ? streak.participant2 : streak.participant1;

                                    return (
                                        <Box key={streak.id}>
                                            <ListItem className="streak-item" disablePadding>
                                                <ListItemButton onClick={() => navigate(`/accounts/profile/${otherParticipant.username}`)} className="streak-button">
                                                    <Box mr={1}>
                                                        <AccountAvatar avatarUrl={otherParticipant.profilePictureUrl} cssEffectStyle={otherParticipant.cssEffectStyle} width={40} height={40} />
                                                    </Box>

                                                    <Box sx={{ flex: 1 }}><Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>{otherParticipant.username}</Typography></Box>
                                                    <Box className="streak-flame">
                                                        <Typography variant="body2" fontWeight="bold" color={streak.length > 0 ? "#ff9800" : "var(--text-primary)"}> {streak.length}</Typography>
                                                        <LocalFireDepartmentIcon sx={{ 
                                                            fontSize: 20, 
                                                            color: streak.length > 0 ? "#ff9800" : "var(--text-primary)" 
                                                        }} />
                                                    </Box>
                                                    {currentAccount?.id === otherParticipant.id && (
                                                        <Tooltip title="Cancel Streak">
                                                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeStreakMutation.mutate(streak.id); }} color="error">
                                                                <DeleteOutlineIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </ListItemButton>
                                            </ListItem>
                                            <Divider sx={{ borderColor: 'var(--bg-3)' }} />
                                        </Box>
                                    );
                                })}
                            </List>
                        ) : <Typography className="empty-state" variant="body2">No active streaks.</Typography>}
                    </Box>
                )}

                {/* Activity tab */}
                {activeTab === 2 && (
                    <Box className="profile-tab-content">
                        <Paper className="activity-section" elevation={0}>
                            <Typography className='activity-section-title' variant="h6">Activity overview</Typography>
                            <Box className="activity-stats">
                                <Box className="activity-stat"><Typography className="activity-stat-label">Problems Solved</Typography><Typography className="activity-stat-value">{userData.account.solvedProblems.length}</Typography></Box>
                                <Box className="activity-stat"><Typography className="activity-stat-label">Quizzes Solved</Typography><Typography className="activity-stat-value">{userData.account.quizzesSolved}</Typography></Box>
                                <Box className="activity-stat"><Typography className="activity-stat-label">Current Coding Problems Streak</Typography><Box className="streak-display"><Typography className="activity-stat-value">{userData.account.streakLength}</Typography><LocalFireDepartmentIcon sx={{ color: '#FF6B35' }} /></Box></Box>
                            </Box>
                            <Box className="activity-graph-container">
                                <Box className="activity-grid">
                                    {userData.activityGraph?.map((count: number, index: number) => {
                                    // Format: [day] [Full month name], [year]
                                    let dateLabel = new Date(Date.now() - (userData.activityGraph.length - 1 - index) * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });

                                        return (
                                            <Tooltip key={index} title={`${count} actions on ${dateLabel}`}>
                                                <Box className={getActivityClass(count)} />
                                            </Tooltip>
                                        )
                                    })}
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Box>

            {/* remove friend dialog */}
            <Dialog open={Boolean(friendToRemove)} 
                    onClose={() => setFriendToRemove(null)}
                    slotProps={{
                        paper: {
                            sx: {
                                backgroundColor: 'var(--bg-1)', 
                                color: 'var(--text-primary)', 
                                p: 3, 
                                borderRadius: '12px' 
                            }
                        }
                    }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>Remove Friend?</Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>Are you sure you want to remove {friendToRemove?.username}?</Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button onClick={() => setFriendToRemove(null)} variant="outlined">Cancel</Button>
                    <Button onClick={() => removeFriendMutation.mutate(friendToRemove!.id)} variant="contained" color="error">Remove</Button>
                </Box>
            </Dialog>

            <ChatDialog 
                open={messageChatOpen} 
                onClose={() => setMessageChatOpen(false)} 
                targetAccount={userData.account} 
                currentAccount={currentAccount} 
            />
        </Box>
    );
}

export default UserProfile;