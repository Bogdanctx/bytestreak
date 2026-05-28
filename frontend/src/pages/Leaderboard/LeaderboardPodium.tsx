import { Box, Chip, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { getLevel, getRank, getRankColor } from '../../utils/rankUtils';
import AccountAvatar from '../../components/ui/AccountAvatar';
import './Leaderboard.style.css';

interface ILeaderboardPodiumProps {
    topThree: any[];
    currentAccount: any;
    navigate: any;
}

function LeaderboardPodium({ topThree, currentAccount, navigate }: ILeaderboardPodiumProps) {
    const getMedalIcon = (rank: number) => {
        const medals = ['🥇', '🥈', '🥉'];
        return medals[rank - 1] || null;
    };

    
    return (
        <Box className="podium-section">
            <Typography variant="subtitle2" className="podium-label">
                <EmojiEventsIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                Top Competitors
            </Typography>
            <Box className="podium-container">
                {topThree.map((account: any, index: number) => {
                    const level = getLevel(account.currentXP);
                    const rank = getRank(level);
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
                            <Box
                                className="podium-avatar"
                                onClick={() => navigate(`/accounts/profile/${account.username}`)}
                            >
                                <AccountAvatar
                                    avatarUrl={account.profilePictureUrl}
                                    cssEffectStyle={account.cssEffectStyle}
                                    width={56}
                                    height={56}
                                />
                            </Box>
                            <Typography
                                className="podium-username"
                                onClick={() => navigate(`/accounts/profile/${account.username}`)}
                            >
                                {account.username}
                            </Typography>
                            <Chip
                                label={`Lvl ${level}`}
                                size="small"
                                className="podium-level-badge"
                                sx={{ color: getRankColor(rank) }}
                            />
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