import { 
    Box, 
    Typography, 
    Avatar, 
    LinearProgress, 
    Divider, 
    IconButton
} from '@mui/material';
import "./AccountOverview.style.css";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAccount } from '../../../hooks/useAccount';
import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import { useNavigate } from 'react-router-dom';
import { getLevel, getRank, getXPProgress, getRankColor } from '../../../utils/rankUtils';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loading from '../../../components/ui/Loading';
import type { IAccount } from '../../../types/account.types';

function AccountOverview() {
    const { data: account } = useAccount();
    const navigate = useNavigate();

    const { data: accountFriends = [] } = useQuery<IAccount[]>({
        queryKey: ['accountFriends'],
        queryFn: async () => {
            const response = await api.get(`/friends/get-friends?accountId=${account.id}`);
            return response.data;
        },
        enabled: !!account
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            return api.post("/auth/logout");
        },
        onSuccess: () => {
            notify("Logging out...", "success");
            setTimeout(() => {
                window.location.href = "/";
            }, 2000);
        },
        onError: (error) => {
            notify("Logout failed. Please try again.", "error");
            console.error("Logout error:", error);
        }
    });

    if (!account) {
        return <Loading />;
    }

    const level = getLevel(account.currentXP);
    const rank = getRank(level);
    const { percentage, currentLevelXP, neededXP } = getXPProgress(account.currentXP);
    const color = getRankColor(rank);

    return (
        <Box id="account-overview-container">
            <Box id="account-overview-header">
                <Box className="account-overview-avatar-ring" sx={{ border: `2px solid ${color}` }}>
                    <Avatar 
                        src={account.profilePictureUrl} 
                        alt={account.username} 
                        className="account-overview-avatar" 
                    />
                </Box>

                <Box className="account-overview-info-column">
                    <Box className="account-overview-top-row">
                        <Box>
                            <Typography variant="h5" className="account-overview-username">
                                {account.username}
                            </Typography>
                            <Box className="account-overview-coin-pill">
                                <span className="stat-emoji">🪙</span>
                                <Typography className="account-overview-coin-value">
                                    {account.coins}
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Box>
                            <Box className="account-overview-actions">
                                <IconButton size="small" onClick={() => navigate("/settings")} sx={{ color: color, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                                    <SettingsIcon fontSize="small" />
                                </IconButton>

                                <IconButton size="small" onClick={() => logoutMutation.mutate()} sx={{ color: color, backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                                    <LogoutIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>

                    <Box className="account-overview-rank-label-container">
                        <Typography variant="caption" className="account-overview-rank-text" sx={{ color: color }}>
                            {rank}
                        </Typography>
                        <Typography variant="caption" className="account-overview-level-text">
                            Lvl {level} • {currentLevelXP}/{neededXP} XP
                        </Typography>
                    </Box>

                    <LinearProgress 
                        variant="determinate" 
                        value={percentage} 
                        className="account-overview-xp-progress-bar" 
                        sx={{ '& .MuiLinearProgress-bar': { backgroundColor: color, boxShadow: `0 0 10px ${color}` } }} 
                    />
                </Box>
            </Box>

            <Divider className="account-overview-divider" />

            <Box id="account-overview-stats-container">
                
                <Box className="account-overview-stat-card">
                    <Typography variant="h4" className="account-overview-stat-value account-overview-streak-value">
                        {account.streakLength}
                        {account.streakLength > 0 && <span className="stat-emoji">🔥</span>}
                    </Typography>
                    <Typography variant="caption" className="account-overview-stat-label" style = {{ textAlign: "center" }}>
                        Day Streak
                    </Typography>
                </Box>

                <Box className="account-overview-stat-card">
                    <Typography variant="h4" className="account-overview-stat-value">
                        {account.codingProblemsSolved}
                    </Typography>
                    <Typography variant="caption" className="account-overview-stat-label">
                        Problems
                    </Typography>
                </Box>

                <Box className="account-overview-stat-card">
                    <Typography variant="h4" className="account-overview-stat-value">
                        {account.quizzesSolved}
                    </Typography>
                    <Typography variant="caption" className="account-overview-stat-label">
                        Quizzes
                    </Typography>
                </Box>

                <Box className="account-overview-stat-card">
                    <Typography variant="h4" className="account-overview-stat-value">
                        {accountFriends.length}
                    </Typography>
                    <Typography variant="caption" className="account-overview-stat-label">
                        Friends
                    </Typography>
                </Box>

            </Box>
        </Box>
    )
}

export default AccountOverview;