import { Box, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountAvatar from '../../components/ui/AccountAvatar';
import './Leaderboard.style.css';
import type { IAccount } from '../../types/account.types';
import { useNavigate } from 'react-router-dom';

interface ILeaderboardPodiumProps {
    topThree: IAccount[];
    currentAccount: IAccount;
}

function LeaderboardPodium({ topThree, currentAccount }: ILeaderboardPodiumProps) {
    const navigate = useNavigate();
    const getMedalIcon = (rank: number) => {
        const medals = ['🥇', '🥈', '🥉'];
        return medals[rank - 1] || null;
    };

    console.log('Rendering LeaderboardPodium with topThree:', topThree);
    
    return (
        <Box className="podium-section">
            <Typography variant="subtitle2" className="podium-label">
                <EmojiEventsIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                Top Competitors
            </Typography>
            <Box className="podium-container">
                {topThree.map((account: IAccount, index: number) => {
                    const position = index + 1;
                    const medal = getMedalIcon(position);

                    return (
                        <Box
                            key={account.id}
                            className={`podium-card position-${position} ${
                                currentAccount.id === account.id ? 'is-current-user' : ''
                            }`}
                            style={{
                                '--podium-height': position === 1 ? '220px' : position === 2 ? '180px' : '160px'
                            } as any}
                        >
                            <Box className="podium-medal">{medal}</Box>
                            <AccountAvatar avatarUrl={account.profilePictureUrl} cssEffectStyle={account.cssEffectStyle} width={56} height={56} />
                            <Typography
                                className="podium-username"
                                onClick={() => navigate(`/accounts/profile/${account.username}`)}
                            >
                                {account.username}
                            </Typography>
                            <Typography className="podium-xp">
                                {account.currentXP.toLocaleString()}
                                <span className="xp-label">XP</span>
                            </Typography>
                            <Box className="podium-rank-number">{position}</Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}

export default LeaderboardPodium;