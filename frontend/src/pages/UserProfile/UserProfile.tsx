import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, Button, Tooltip, Stack, CircularProgress } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api'; // Adjust path if necessary
import notify from '../../components/ui/ToastNotification'; // Adjust path if necessary
import './UserProfile.style.css';

export interface UserProfileData {
    username: string;
    avatarUrl: string;
    level: number;
    rank: string;
    coins: number;
    friendsCount: number;
    problemsSolved: number;
    quizzesSolved: number;
    isFriend: boolean;
    streakLength: number; 
    activityHistory: number[]; 
}

function UserProfile() {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch Profile Data
    const { data: profile, isLoading, isError } = useQuery<UserProfileData>({
        queryKey: ['profile', username],
        queryFn: async () => {
            const response = await api.get(`/accounts/profile/${username}`);
            return response.data;
        },
        enabled: !!username // Only run query if username exists
    });

    // Mutations
    const removeFriendMutation = useMutation({
        mutationFn: () => api.post(`/friends/remove/${username}`),
        onSuccess: () => {
            notify("Friend removed.", "success");
            queryClient.invalidateQueries({ queryKey: ['profile', username] });
        },
        onError: () => notify("Failed to remove friend.", "error")
    });

    const cancelStreakMutation = useMutation({
        mutationFn: () => api.post(`/friends/cancel-streak/${username}`),
        onSuccess: () => {
            notify("Streak successfully cancelled. Slot freed.", "success");
            queryClient.invalidateQueries({ queryKey: ['profile', username] });
        },
        onError: () => notify("Failed to cancel streak.", "error")
    });

    // Loading & Error States
    if (isLoading) {
        return (
            <Box id="profile-page-container" justifyContent="center">
                <CircularProgress sx={{ color: 'var(--accent-main)' }} />
            </Box>
        );
    }

    if (isError || !profile) {
        return (
            <Box id="profile-page-container" justifyContent="center">
                <Typography color="error" variant="h5">Profile not found.</Typography>
                <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2, color: 'var(--text-primary)' }}>
                    Return to Dashboard
                </Button>
            </Box>
        );
    }

    // Helper for the Activity Graph Heatmap
    const getActivityClass = (count: number) => {
        if (count === 0) return 'activity-day';
        if (count < 3) return 'activity-day activity-level-1';
        if (count < 6) return 'activity-day activity-level-2';
        if (count < 10) return 'activity-day activity-level-3';
        return 'activity-day activity-level-4';
    };

    return (
        <Box id="profile-page-container">
            <Box className="profile-card">
                
                {/* Header Section */}
                <Box className="profile-header">
                    <Avatar src={profile.avatarUrl} className="profile-avatar" />
                    <Box>
                        <Typography className="profile-username">{profile.username}</Typography>
                        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" useFlexGap>
                            <Typography className="profile-badge">Lvl {profile.level}</Typography>
                            <Typography className="profile-badge">{profile.rank}</Typography>
                            <Typography className="profile-badge">💰 {profile.coins}</Typography>
                        </Stack>
                    </Box>
                </Box>

                {/* Stats Section */}
                <Box className="profile-stats-grid">
                    <Box className="stat-item">
                        <Typography className="stat-value">{profile.friendsCount}</Typography>
                        <Typography className="stat-label">Friends</Typography>
                    </Box>
                    <Box className="stat-item">
                        <Typography className="stat-value">{profile.problemsSolved}</Typography>
                        <Typography className="stat-label">Problems Solved</Typography>
                    </Box>
                    <Box className="stat-item">
                        <Typography className="stat-value">{profile.quizzesSolved}</Typography>
                        <Typography className="stat-label">Quizzes Passed</Typography>
                    </Box>
                </Box>

                {/* Interactive Actions (Only visible if they are friends) */}
                {profile.isFriend && (
                    <Box className="profile-actions">
                        <Button 
                            variant="contained" 
                            sx={{ 
                                backgroundColor: 'var(--accent-main)', 
                                color: '#000', 
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: 'var(--accent-hover)' }
                            }}
                            onClick={() => navigate(`/messages/${username}`)}
                        >
                            Send Message
                        </Button>
                        
                        <Button 
                            variant="outlined" 
                            color="error"
                            disabled={removeFriendMutation.isPending}
                            onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${username}?`)) {
                                    removeFriendMutation.mutate();
                                }
                            }}
                        >
                            {removeFriendMutation.isPending ? "Removing..." : "Remove Friend"}
                        </Button>

                        {/* Gamification: The Streak Limit Mechanic */}
                        {profile.streakLength > 0 && (
                            <Stack direction="row" spacing={2} alignItems="center" ml={{ xs: 0, sm: 'auto' }}>
                                <Tooltip title="Active Streak">
                                    <Typography sx={{ color: '#ff9800', fontWeight: 'bold', fontSize: '18px' }}>
                                        🔥 {profile.streakLength} Day Streak
                                    </Typography>
                                </Tooltip>
                                <Button 
                                    variant="text" 
                                    color="error" 
                                    size="small"
                                    disabled={cancelStreakMutation.isPending}
                                    onClick={() => {
                                        if (window.confirm("Cancel this streak to free up a slot? This cannot be undone.")) {
                                            cancelStreakMutation.mutate();
                                        }
                                    }}
                                >
                                    Cancel Streak
                                </Button>
                            </Stack>
                        )}
                    </Box>
                )}

                {/* GitHub-style Activity Graph */}
                <Typography sx={{ color: 'var(--text-primary)', mb: 2, fontFamily: "Momo Trust Display", fontSize: '20px' }}>
                    Platform Activity
                </Typography>
                <Box className="activity-graph-container">
                    <Box className="activity-grid">
                        {profile.activityHistory?.map((count, index) => (
                            <Tooltip key={index} title={`${count} contributions on day ${index + 1}`}>
                                <Box className={getActivityClass(count)} />
                            </Tooltip>
                        ))}
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}

export default UserProfile;