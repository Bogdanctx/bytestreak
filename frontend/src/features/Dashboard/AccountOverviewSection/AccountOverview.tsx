import { Box, Typography, Avatar, LinearProgress, Divider } from '@mui/material';
import "./AccountOverview.style.css";

const userData = {
    username: "Bogdan",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    rank: "Terabyte",
    level: 34,
    currentXP: 900,
    maxXP: 1000,
    problemsSolved: 42,
    quizzesDone: 15,
    streak: 7,
    friends: 8
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

function AccountOverview() {
    const progress = (userData.currentXP / userData.maxXP) * 100;
    const color = getRankColor(userData.rank);

    return (
        <Box id="account-overview-container">
            <Box id="account-overview-header">
                <Avatar src={userData.avatarUrl} alt={userData.username} className="account-overview-avatar" sx={{ border: `2px solid ${color}` }}  />

                <Box className="account-overview-info-column">
                    <Typography variant="h5" className="account-overview-username">
                        {userData.username}
                    </Typography>

                    <Box className="account-overview-rank-label-container">
                        <Typography variant="caption" className="account-overview-rank-text" sx={{ color: `${color}`}}>
                            {userData.rank}
                        </Typography>
                        <Typography variant="caption" className="account-overview-level-text">
                            Lvl {userData.level} • {userData.currentXP}/{userData.maxXP} XP
                        </Typography>
                    </Box>

                    <LinearProgress variant="determinate" value={progress} className="account-overview-xp-progress-bar" sx={{ '& .MuiLinearProgress-bar': { backgroundColor: `${getRankColor(userData.rank)}` } }} />
                </Box>
            </Box>

            <Divider className="account-overview-divider" />

            <Box id="account-overview-stats-container">
                
                <Box className="account-overview-stat-item">
                    <Typography variant="h4" className="account-overview-stat-value account-overview-streak-value">
                        {userData.streak}
                        <span style={{ fontSize: '1rem' }}>🔥</span>
                    </Typography>
                    <Typography variant="caption" className="account-overview-stat-label">
                        Day Streak
                    </Typography>
                </Box>

                <Box className="account-overview-stat-item">
                    <Typography variant="h4" className="account-overview-stat-value">
                        {userData.problemsSolved}
                    </Typography>
                    <Typography variant="caption" className="account-overview-stat-label">
                        Problems
                    </Typography>
                </Box>

                <Box className="account-overview-stat-item">
                    <Typography variant="h4" className="account-overview-stat-value">
                        {userData.quizzesDone}
                    </Typography>
                    <Typography variant="caption" className="account-overview-stat-label">
                        Quizzes
                    </Typography>
                </Box>

                <Box className="account-overview-stat-item">
                    <Typography variant="h4" className="account-overview-stat-value">
                        {userData.friends}
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