import { Box, Typography, Avatar, Button, Tab, Tabs, Dialog, TextField, CircularProgress, List, ListItem, ListItemButton, Divider, Tooltip, IconButton, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { type IUserProfile } from '../../types/userProfile.types';
import { type IAccount } from '../../types/account.types';
import { type IMessage, type IAttachment } from '../../types/message.types';
import './UserProfile.style.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Loading from '../../components/ui/Loading';
import { useAccount } from '../../hooks/useAccount';
import { api } from '../../api';
import { getLevel, getRank, getRankColor } from '../../utils/rankUtils';
import { useState, useEffect, useRef } from 'react';
import notify from '../../components/ui/ToastNotification';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MessageIcon from '@mui/icons-material/Message';
import ClearIcon from '@mui/icons-material/Clear';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import { useWebSocket } from '../../context/WebSocketContext';

function UserProfile() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: currentAccount } = useAccount();

    const [activeTab, setActiveTab] = useState(0);
    const [messageChatOpen, setMessageChatOpen] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<IAttachment[]>([]);
    const [friendToRemove, setFriendToRemove] = useState<IAccount | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { stompClient } = useWebSocket();

    // Fetch user profile data
    const { data: userData, isLoading } = useQuery<IUserProfile>({
        queryKey: ['userProfile', username],
        queryFn: async () => {
            const response = await api.get(`/profile/${username}`);
            return response.data;
        },
        enabled: !!username,
    });

    // Fetch messages for this user
    const { data: messagesData = [] } = useQuery<IMessage[]>({
        queryKey: ['messages', userData?.account.id],
        queryFn: async () => {
            if (!userData?.account.id) return [];
            const response = await api.get(`/social/messages/conversation?otherUserId=${userData.account.id}`);
            return response.data;
        },
        enabled: !!userData?.account.id && messageChatOpen
    });

    // Subscribe to real-time messages
    useEffect(() => {
        if (stompClient && stompClient.connected && messageChatOpen && userData?.account.id) {
            const subscription = stompClient.subscribe(`/user/queue/messages`, (message) => {
                const newLiveMessage = JSON.parse(message.body);

                if (newLiveMessage.sender.id === userData.account.id) {
                    queryClient.setQueryData(['messages', userData.account.id], (oldData: IMessage[] | undefined) => {
                        const previousMessages = oldData ?? [];
                        return [...previousMessages, newLiveMessage];
                    });
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [stompClient, messageChatOpen, userData?.account.id, queryClient]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messagesData, selectedFiles]);

    const isMyProfile = currentAccount?.id === userData?.account.id;
    const isFriend = userData?.account.friends?.some(friend => friend.id === currentAccount?.id);

    const removeFriendMutation = useMutation({
        mutationFn: async (friendId: number) => {
            return api.post(`/friends/remove?friendId=${friendId}`);
        },
        onSuccess: () => {
            if (!friendToRemove) return;
            setFriendToRemove(null);
            queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
            notify(`${friendToRemove.username} has been removed from your friends list.`, "success");
        },
        onError: () => notify("Failed to remove friend. Please try again.", "error")
    });

    const removeStreakMutation = useMutation({
        mutationFn: async (streakId: number) => {
            return api.delete(`/streaks/delete-streak?streakId=${streakId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile', username] });
            notify("Streak has been removed", "success");
        },
        onError: () => notify("Failed to remove streak. Please try again.", "error")
    });

    const sendMessageMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post(`/social/messages/send?receiverId=${userData?.account.id}`, {
                text: messageInput,
                attachments: selectedFiles.map(file => ({
                    id: null,
                    filename: file.filename,
                    filedata: file.filedata
                }))
            });
            return response.data; // CORE FIX: return just the data to avoid "undefined sender" error
        },
        onSuccess: (savedMessage) => {
            queryClient.setQueryData(['messages', userData?.account.id], (oldData: IMessage[] | undefined) => {
                const previousMessages = oldData ?? [];
                return [...previousMessages, savedMessage];
            });
            setMessageInput('');
            setSelectedFiles([]);
        },
        onError: () => notify("Failed to send message. Please try again.", "error")
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setSelectedFiles(prev => [...prev, { id: null, filename: file.name, filedata: base64String }]);
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const renderFormattedText = (text: string) => {
        const parts = text.split(/(`[^`]+`)/g);
        return parts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                return (
                    <Box component="span" key={index} sx={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '2px 4px', borderRadius: '4px', fontFamily: 'monospace' }}>
                        {part.slice(1, -1)}
                    </Box>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    if (isLoading || !userData) {
        return <Loading />;
    }

    const { account, streaks } = userData;
    const level = getLevel(account.currentXP);
    const rank = getRank(level);
    const rankColor = getRankColor(rank);

    const userStreaks = streaks.filter(
        s => s.participant1.id === account.id || s.participant2.id === account.id
    );

    return (
        <Box className="user-profile-container">
            {/* Header Section */}
            <Box className="profile-header">
                <Box className="profile-header-content">
                    <Avatar
                        src={account.profilePictureUrl}
                        alt={account.username}
                        className="profile-avatar"
                        sx={{ borderColor: rankColor }}
                    >
                        {account.username.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box className="profile-header-info">
                        <Typography className="profile-username" variant="h4">
                            {account.username}
                        </Typography>
                        <Box className="profile-rank-container">
                            <Typography className="profile-rank" variant="body2" sx={{ color: rankColor }}>
                                {rank.toUpperCase()}
                            </Typography>
                            <Typography className="profile-level" variant="body2">
                                Level {level}
                            </Typography>
                        </Box>
                        {account.bio && (
                            <Typography className="profile-bio" variant="body2">
                                {account.bio}
                            </Typography>
                        )}
                    </Box>

                    <Box className="profile-stats">
                        <Box className="stat-item">
                            <Typography className="stat-label">Coins</Typography>
                            <Typography className="stat-value">{account.coins}</Typography>
                        </Box>
                        <Box className="stat-item">
                            <Typography className="stat-label">Problems Solved</Typography>
                            <Typography className="stat-value">{account.codingProblemsSolved}</Typography>
                        </Box>
                        <Box className="stat-item">
                            <Typography className="stat-label">Quizzes Solved</Typography>
                            <Typography className="stat-value">{account.quizzesSolved}</Typography>
                        </Box>
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
                                onClick={() => setFriendToRemove(account)}
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
                </Box>
            </Box>

            {/* Tabs Section */}
            <Box className="profile-tabs-container">
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    className="profile-tabs"
                    sx={{
                        borderBottom: '1px solid var(--bg-3)',
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'var(--accent-main)'
                        }
                    }}
                >
                    <Tab
                        label={`Friends (${account.friends.length})`}
                        sx={{
                            color: 'var(--text-secondary)',
                            '&.Mui-selected': { color: 'var(--text-primary)' }
                        }}
                    />
                    <Tab
                        label={`Streaks (${userStreaks.length})`}
                        sx={{
                            color: 'var(--text-secondary)',
                            '&.Mui-selected': { color: 'var(--text-primary)' }
                        }}
                    />
                    <Tab
                        label="Activity"
                        sx={{
                            color: 'var(--text-secondary)',
                            '&.Mui-selected': { color: 'var(--text-primary)' }
                        }}
                    />
                </Tabs>

                {/* Friends Tab */}
                {activeTab === 0 && (
                    <Box className="profile-tab-content">
                        {account.friends.length > 0 ? (
                            <List className="friends-list">
                                {account.friends.map((friend) => (
                                    <Box key={friend.id}>
                                        <ListItem className="friend-item" disablePadding>
                                            <ListItemButton
                                                onClick={() => navigate(`/profile/${friend.username}`)}
                                                className="friend-button"
                                            >
                                                <Avatar
                                                    src={friend.profilePictureUrl}
                                                    alt={friend.username}
                                                    sx={{ mr: 2, width: 40, height: 40 }}
                                                >
                                                    {friend.username.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>
                                                        {friend.username}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                                                        {friend.codingProblemsSolved} problems solved
                                                    </Typography>
                                                </Box>

                                                {!isMyProfile && currentAccount?.id === friend.id && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFriendToRemove(account);
                                                        }}
                                                        sx={{
                                                            borderColor: 'var(--difficulty-hard)',
                                                            color: 'var(--difficulty-hard)',
                                                            '&:hover': {
                                                                borderColor: '#ff6b6b',
                                                                backgroundColor: 'rgba(255, 107, 107, 0.1)'
                                                            }
                                                        }}
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
                        ) : (
                            <Typography className="empty-state" variant="body2">
                                {isMyProfile ? 'You have no friends yet' : 'This account has no friends'}
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Streaks Tab */}
                {activeTab === 1 && (
                    <Box className="profile-tab-content">
                        {userStreaks.length > 0 ? (
                            <List className="streaks-list">
                                {userStreaks.map((streak) => {
                                    const streakFriend = streak.participant1.id === account.id ? streak.participant2 : streak.participant1;
                                    const isMeParticipant = currentAccount?.id === account.id;

                                    return (
                                        <Box key={streak.id}>
                                            <ListItem className="streak-item" disablePadding>
                                                <ListItemButton
                                                    onClick={() => navigate(`/profile/${streakFriend.username}`)}
                                                    className="streak-button"
                                                >
                                                    <Avatar
                                                        src={streakFriend.profilePictureUrl}
                                                        alt={streakFriend.username}
                                                        sx={{ mr: 2, width: 40, height: 40 }}
                                                    >
                                                        {streakFriend.username.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>
                                                            {streakFriend.username}
                                                        </Typography>
                                                    </Box>

                                                    <Box className="streak-flame">
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {streak.length}
                                                        </Typography>
                                                        <LocalFireDepartmentIcon sx={{ fontSize: 20, color: '#FF6B35' }} />
                                                    </Box>

                                                    {isMeParticipant && (
                                                        <Tooltip title="Remove Streak">
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeStreakMutation.mutate(streak.id);
                                                                }}
                                                                disabled={removeStreakMutation.isPending}
                                                                sx={{
                                                                    color: 'var(--text-secondary)',
                                                                    '&:hover': { color: 'var(--difficulty-hard)' }
                                                                }}
                                                            >
                                                                {removeStreakMutation.isPending ? (
                                                                    <CircularProgress size={20} />
                                                                ) : (
                                                                    <DeleteOutlineIcon fontSize="small" />
                                                                )}
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
                        ) : (
                            <Typography className="empty-state" variant="body2">
                                {isMyProfile ? 'You have no active streaks' : 'This account has no active streaks'}
                            </Typography>
                        )}
                    </Box>
                )}

                {/* Activity Tab */}
                {activeTab === 2 && (
                    <Box className="profile-tab-content">
                        <Paper className="activity-section" elevation={0}>
                            <Box className="activity-header">
                                <Typography variant="h6">Activity Overview</Typography>
                            </Box>

                            <Box className="activity-stats">
                                <Box className="activity-stat">
                                    <Typography className="activity-stat-label">Total Problems Solved</Typography>
                                    <Typography className="activity-stat-value">{account.codingProblemsSolved}</Typography>
                                </Box>
                                <Box className="activity-stat">
                                    <Typography className="activity-stat-label">Total Quizzes Solved</Typography>
                                    <Typography className="activity-stat-value">{account.quizzesSolved}</Typography>
                                </Box>
                                <Box className="activity-stat">
                                    <Typography className="activity-stat-label">Current Streak Length</Typography>
                                    <Box className="streak-display">
                                        <Typography className="activity-stat-value">{account.streakLength}</Typography>
                                        <LocalFireDepartmentIcon sx={{ color: '#FF6B35', fontSize: 24 }} />
                                    </Box>
                                </Box>
                            </Box>

                            <Box className="activity-chart-placeholder">
                                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', textAlign: 'center', py: 4 }}>
                                    Daily activity history coming soon
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Box>

            {/* Remove Friend Dialog */}
            <Dialog
                open={Boolean(friendToRemove)}
                onClose={() => setFriendToRemove(null)}
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: 'var(--bg-1)',
                            color: 'var(--text-primary)',
                            borderRadius: '12px'
                        }
                    }
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Remove Friend?</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
                        Are you sure you want to remove <strong>{friendToRemove?.username}</strong> from your friends list?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            onClick={() => setFriendToRemove(null)}
                            variant="outlined"
                            sx={{ color: 'var(--text-secondary)' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => removeFriendMutation.mutate(friendToRemove!.id)}
                            variant="contained"
                            disabled={removeFriendMutation.isPending}
                            sx={{
                                backgroundColor: 'var(--difficulty-hard)',
                                '&:hover': { backgroundColor: '#d32f2f' }
                            }}
                        >
                            {removeFriendMutation.isPending ? <CircularProgress size={20} /> : 'Remove'}
                        </Button>
                    </Box>
                </Box>
            </Dialog>

            {/* Send Message Chat Dialog */}
            <Dialog
                open={messageChatOpen}
                onClose={() => setMessageChatOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'var(--bg-1)',
                        color: 'var(--text-primary)',
                        borderRadius: '12px',
                        height: '600px',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                {/* Chat Header */}
                <Box sx={{
                    backgroundColor: 'var(--bg-2)',
                    borderBottom: '1px solid var(--bg-3)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                            src={userData.account.profilePictureUrl}
                            sx={{ width: 32, height: 32 }}
                        >
                            {userData.account.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {userData.account.username}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                                Level {getLevel(userData.account.currentXP)}
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton
                        onClick={() => setMessageChatOpen(false)}
                        size="small"
                        sx={{ color: 'var(--text-secondary)' }}
                    >
                        <ClearIcon />
                    </IconButton>
                </Box>

                {/* Messages Container */}
                <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    backgroundColor: 'var(--bg-1)',
                    '&::-webkit-scrollbar': {
                        width: '6px'
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'var(--bg-8)',
                        borderRadius: '4px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: 'var(--bg-7)'
                    }
                }}>
                    {messagesData.length === 0 ? (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%'
                        }}>
                            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                                Say hi to {userData.account.username}!
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {messagesData.map((message) => (
                                <Box
                                    key={message.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: message.sender.id === currentAccount?.id ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            padding: '8px 12px',
                                            maxWidth: '70%',
                                            wordWrap: 'break-word',
                                            backgroundColor: message.sender.id === currentAccount?.id
                                                ? 'var(--accent-main)'
                                                : 'var(--bg-3)',
                                            color: message.sender.id === currentAccount?.id
                                                ? '#fff'
                                                : 'var(--text-primary)'
                                        }}
                                    >
                                        {/* Render Attachments */}
                                        {message.attachments?.map((file, index) => {
                                            if (file.filedata.startsWith('data:image')) {
                                                return <img key={index} src={file.filedata} alt={file.filename} style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '8px' }} />
                                            }
                                            return (
                                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'rgba(0,0,0,0.1)', p: 1, borderRadius: 1, mb: 1 }}>
                                                    <AttachFileIcon fontSize="small" />
                                                    <Typography variant="caption" noWrap sx={{ flex: 1, maxWidth: '150px' }}>{file.filename}</Typography>
                                                    <IconButton component="a" href={file.filedata} download={file.filename} size="small" color="inherit">
                                                        <DownloadIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            );
                                        })}
                                        
                                        {/* Render Text */}
                                        {message.text && (
                                            <Typography variant="body2">
                                                {renderFormattedText(message.text)}
                                            </Typography>
                                        )}
                                    </Paper>
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </Box>

                {/* Input Area with File Previews */}
                <Box sx={{
                    borderTop: '1px solid var(--bg-3)',
                    padding: '12px',
                    backgroundColor: 'var(--bg-2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    {/* Previews */}
                    {selectedFiles.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                            {selectedFiles.map((file, index) => (
                                <Box key={index} sx={{ position: 'relative', flexShrink: 0 }}>
                                    {file.filedata.startsWith('data:image') ? (
                                        <img src={file.filedata} alt={file.filename} style={{ height: '60px', borderRadius: '4px' }} />
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, backgroundColor: 'var(--bg-3)', borderRadius: 1, height: '60px' }}>
                                            <AttachFileIcon fontSize="small" />
                                            <Typography variant="caption" sx={{ ml: 1, maxWidth: '80px' }} noWrap>{file.filename}</Typography>
                                        </Box>
                                    )}
                                    <IconButton 
                                        size="small" 
                                        onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))} 
                                        sx={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'var(--bg-4)', width: '20px', height: '20px' }}
                                    >
                                        <ClearIcon sx={{ fontSize: '14px' }} />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Controls */}
                    <Box sx={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                        <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} accept="image/*,.pdf,.txt" style={{ display: 'none' }} />
                        <IconButton 
                            onClick={() => fileInputRef.current?.click()} 
                            sx={{ color: selectedFiles.length > 0 ? 'var(--accent-main)' : 'var(--text-secondary)' }}
                        >
                            <AttachFileIcon />
                        </IconButton>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Type a message... (use `code`)"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (messageInput.trim() || selectedFiles.length > 0) {
                                        sendMessageMutation.mutate();
                                    }
                                }
                            }}
                            disabled={sendMessageMutation.isPending}
                            multiline
                            maxRows={3}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'var(--bg-1)',
                                    color: 'var(--text-primary)',
                                    '& fieldset': {
                                        borderColor: 'var(--bg-4)'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'var(--accent-main)'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'var(--accent-main)'
                                    }
                                },
                                '& .MuiOutlinedInput-input::placeholder': {
                                    color: 'var(--text-secondary)',
                                    opacity: 0.7
                                }
                            }}
                        />
                        <IconButton
                            onClick={() => {
                                if (messageInput.trim() || selectedFiles.length > 0) {
                                    sendMessageMutation.mutate();
                                }
                            }}
                            disabled={(!messageInput.trim() && selectedFiles.length === 0) || sendMessageMutation.isPending}
                            sx={{
                                color: (!messageInput.trim() && selectedFiles.length === 0) ? 'var(--text-secondary)' : 'var(--accent-main)',
                                '&:hover': {
                                    backgroundColor: 'rgba(35, 206, 107, 0.1)'
                                }
                            }}
                        >
                            {sendMessageMutation.isPending ? <CircularProgress size={20} /> : <SendIcon />}
                        </IconButton>
                    </Box>
                </Box>
            </Dialog>
        </Box>
    );
}

export default UserProfile;