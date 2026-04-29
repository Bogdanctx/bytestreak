import { 
    Box, 
    Typography, 
    Avatar, 
    LinearProgress, 
    Divider, 
    Button
} from '@mui/material';
import "./AccountOverview.style.css";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAccount } from '../../../hooks/useAccount';
import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import { useNavigate } from 'react-router-dom';
import { getLevelMaxXP, getRankByLevel, getRankColor } from '../../../utils/rankUtils';

function AccountOverview() {
    const { data: account } = useAccount();
    const navigate = useNavigate();

    const handleLogout = () => {
        api.post("/auth/logout")
            .then((response) => {
                if(response.status === 200) {
                    notify("Logging out...", "success");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000);
                }
                else {
                    notify("Logout failed. Please try again.", "error");
                }
            })
            .catch((error) => {
                notify("Logout failed. Please try again.", "error");
                console.error("Logout error:", error);
            });
    }

    const maxXP = getLevelMaxXP(account.level);
    const accountRank = getRankByLevel(account.level);
    const color = getRankColor(accountRank);
    const progress = (account.currentXP / maxXP) * 100;

    return (
        <Box id="account-overview-container">
            <Box id="account-overview-header">
                <Avatar src={account.profilePictureUrl} alt={account.username} className="account-overview-avatar" sx={{ border: `2px solid ${color}` }}  />

                <Box className="account-overview-info-column">
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                        <Typography variant="h5" className="account-overview-username">
                            {account.username}
                        </Typography>
                        <Box display={"flex"} alignItems={"center"} gap={1}>
                            <Button sx={{ padding: 0, minWidth: 'auto' }} onClick={() => navigate("/settings")}>
                                <SettingsIcon fontSize="small" sx={{ color: `${color}` }} />
                            </Button>

                            <Button sx={{ padding: 0, minWidth: 'auto' }} onClick={handleLogout}>
                                <LogoutIcon fontSize="small" sx={{ color: `${color}` }} />
                            </Button>
                        </Box>
                    </Box>

                    <Box className="account-overview-rank-label-container">
                        <Typography variant="caption" className="account-overview-rank-text" sx={{ color: `${color}`}}>
                            {accountRank}
                        </Typography>
                        <Typography variant="caption" className="account-overview-level-text">
                            Lvl {account.level} • {account.currentXP}/{maxXP} XP
                        </Typography>
                    </Box>

                    <LinearProgress variant="determinate" value={progress} 
                                    className="account-overview-xp-progress-bar" 
                                    sx={{ '& .MuiLinearProgress-bar': { backgroundColor: `${color}` } }} />
                </Box>
            </Box>

            <Divider className="account-overview-divider" />

            <Box id="account-overview-stats-container">
                
                <Box className="account-overview-stat-item">
                    {account.streakLength > 0 ? (
                        <Typography variant="h4" className="account-overview-stat-value account-overview-streak-value">
                            {account.streakLength}
                            <span style={{ fontSize: '1rem' }}>🔥</span>
                        </Typography>
                    ) : (
                        <Typography variant="h4" className="account-overview-stat-value">
                            {account.streakLength}
                        </Typography>
                    )}
                    <Typography variant="caption" className="account-overview-stat-label">
                        Day Streak
                    </Typography>
                </Box>

                <Box className="account-overview-stat-item">
                    <Typography variant="h4" className="account-overview-stat-value">
                        {account.problemsSolved}
                    </Typography>
                    <Typography variant="caption" className="account-overview-stat-label">
                        Problems
                    </Typography>
                </Box>

                <Box className="account-overview-stat-item">
                    <Typography variant="h4" className="account-overview-stat-value">
                        {account.quizzesSolved}
                    </Typography>
                    <Typography variant="caption" className="account-overview-stat-label">
                        Quizzes
                    </Typography>
                </Box>

                <Box className="account-overview-stat-item">
                    <Typography variant="h4" className="account-overview-stat-value">
                        {account.friends.length}
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