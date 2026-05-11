import { useState } from 'react';
import { Box, Tab, Tabs, Typography, List, ListItem, ListItemButton, Avatar, Divider, Button, Tooltip, IconButton, CircularProgress, Dialog, Paper } from '@mui/material';
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

function UserProfile() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: currentAccount } = useAccount();

    const [activeTab, setActiveTab] = useState(0);
    const [messageChatOpen, setMessageChatOpen] = useState(false);
    const [friendToRemove, setFriendToRemove] = useState<IAccount | null>(null);

    const { data: userData, isLoading } = useQuery<IUserProfile>({
        queryKey: ['userProfile', username],
        queryFn: async () => (await api.get(`/profile/${username}`)).data,
        enabled: !!username,
    });

    const removeFriendMutation = useMutation({
        mutationFn: async (friendId: number) => api.post(`/friends/remove?friendId=${friendId}`),
        onSuccess: () => {
            setFriendToRemove(null);
            queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
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

    if (isLoading || !userData) return <Loading />;

    const { account, streaks } = userData;
    const isMyProfile = currentAccount?.id === account.id;
    const userStreaks = streaks.filter(s => s.participant1.id === account.id || s.participant2.id === account.id);

    const getActivityClass = (count: number) => {
        if (count === 0) return 'activity-day';
        if (count < 3) return 'activity-day activity-level-1';
        if (count < 6) return 'activity-day activity-level-2';
        if (count < 10) return 'activity-day activity-level-3';
        return 'activity-day activity-level-4';
    };

    return (
        <Box className="user-profile-container">
            <ProfileHeader 
                target={userData} 
                myAccount={currentAccount!} 
                setMessageChatOpen={setMessageChatOpen} 
                setFriendToRemove={setFriendToRemove} 
            />

            <Box className="profile-tabs-container">
                <Tabs value={activeTab} onChange={(_, nv) => setActiveTab(nv)} className="profile-tabs" sx={{ borderBottom: '1px solid var(--bg-3)' }}>
                    <Tab label={`Friends (${account.friends.length})`} sx={{ color: 'var(--text-secondary)', '&.Mui-selected': { color: 'var(--text-primary)' } }} />
                    <Tab label={`Streaks (${userStreaks.length})`} sx={{ color: 'var(--text-secondary)', '&.Mui-selected': { color: 'var(--text-primary)' } }} />
                    <Tab label="Activity" sx={{ color: 'var(--text-secondary)', '&.Mui-selected': { color: 'var(--text-primary)' } }} />
                </Tabs>

                {/* Friends tab */}
                {activeTab === 0 && (
                    <Box className="profile-tab-content">
                        {account.friends.length > 0 ? (
                            <List className="friends-list">
                                {account.friends.map((friend) => (
                                    <Box key={friend.id}>
                                        <ListItem className="friend-item" disablePadding>
                                            <ListItemButton onClick={() => navigate(`/profile/${friend.username}`)} className="friend-button">
                                                <Avatar src={friend.profilePictureUrl} sx={{ mr: 2, width: 40, height: 40 }}>{friend.username.charAt(0).toUpperCase()}</Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>{friend.username}</Typography>
                                                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>{friend.codingProblemsSolved} problems solved</Typography>
                                                </Box>
                                                {!isMyProfile && currentAccount?.id === friend.id && (
                                                    <Button size="small" variant="outlined" onClick={(e) => { e.stopPropagation(); setFriendToRemove(account); }} color="error">Remove</Button>
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
                                    const friend = streak.participant1.id === account.id ? streak.participant2 : streak.participant1;
                                    return (
                                        <Box key={streak.id}>
                                            <ListItem className="streak-item" disablePadding>
                                                <ListItemButton onClick={() => navigate(`/profile/${friend.username}`)} className="streak-button">
                                                    <Avatar src={friend.profilePictureUrl} sx={{ mr: 2, width: 40, height: 40 }}>{friend.username.charAt(0).toUpperCase()}</Avatar>
                                                    <Box sx={{ flex: 1 }}><Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>{friend.username}</Typography></Box>
                                                    <Box className="streak-flame">
                                                        <Typography variant="body2" fontWeight="bold">{streak.length}</Typography>
                                                        <LocalFireDepartmentIcon sx={{ fontSize: 20, color: '#FF6B35' }} />
                                                    </Box>
                                                    {currentAccount?.id === account.id && (
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
                            <Typography variant="h6" sx={{ mb: 3 }}>Activity Overview</Typography>
                            <Box className="activity-stats">
                                <Box className="activity-stat"><Typography className="activity-stat-label">Problems Solved</Typography><Typography className="activity-stat-value">{account.codingProblemsSolved}</Typography></Box>
                                <Box className="activity-stat"><Typography className="activity-stat-label">Quizzes Solved</Typography><Typography className="activity-stat-value">{account.quizzesSolved}</Typography></Box>
                                <Box className="activity-stat"><Typography className="activity-stat-label">Current Streak</Typography><Box className="streak-display"><Typography className="activity-stat-value">{account.streakLength}</Typography><LocalFireDepartmentIcon sx={{ color: '#FF6B35' }} /></Box></Box>
                            </Box>
                            <Box className="activity-graph-container">
                                <Box className="activity-grid">
                                    {userData.activityGraph?.map((count: number, index: number) => (
                                        <Tooltip key={index} title={`${count} contributions`}>
                                            <Box className={getActivityClass(count)} />
                                        </Tooltip>
                                    ))}
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