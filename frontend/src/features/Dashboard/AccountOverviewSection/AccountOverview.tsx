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
import { useAccountContext } from '../../../context/AccountContext';

const rankLevels: { [key: string]: number } = {
    "Bit": 0,
    "Byte": 4,
    "Kilobyte": 8,
    "Megabyte": 16,
    "Gigabyte": 24,
    "Terabyte": 36
};

const getRankColor = (rank: string) => {
    switch(rank) {
        case "Bit":
            return "#4A4A4A";
        case "Byte":
            return "#23CE6B";
        case "Kilobyte":
            return "#00F0FF";
        case "Megabyte":
            return "#7B61FF";
        case "Gigabyte":
            return "#FF8C00"; 
        case "Terabyte":
            return "#FF2E63";    
        default:
            return "#FFFFFF";
    }
};

const getRankByLevel = (level: number) => {
    if(level >= rankLevels["Terabyte"]) return "Terabyte";
    if(level >= rankLevels["Gigabyte"]) return "Gigabyte";
    if(level >= rankLevels["Megabyte"]) return "Megabyte";
    if(level >= rankLevels["Kilobyte"]) return "Kilobyte";
    if(level >= rankLevels["Byte"]) return "Byte";
    return "Bit";
}

const getLevelMaxXP = (level: number) => {
    return 100 + (level * 20);
}

function AccountOverview() {
    const { account } = useAccountContext();

    if (!account) {
        return null;
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
                        <Box>
                            <Button sx={{ padding: 0, minWidth: 'auto' }} onClick={() => window.location.href = "/settings"}>
                                <SettingsIcon fontSize="small" sx={{ color: `${color}` }} />
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
                        {account.friendsCount}
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