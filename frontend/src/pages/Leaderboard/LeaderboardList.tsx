import { Box, CircularProgress, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getLevel, getRank, getRankColor } from '../../utils/rankUtils';
import AccountAvatar from '../../components/ui/AccountAvatar';
import './Leaderboard.style.css';

interface ILeaderboardListProps {
    accounts: any[];
    isLoading: boolean;
    isSearchMode: boolean;
    currentAccount: any;
    navigate: any;
}

function LeaderboardList({ accounts, currentAccount, navigate, isLoading, isSearchMode }: ILeaderboardListProps) {
    return (
        <Box className="leaderboard-content">
            {!isSearchMode && (
                <Typography variant="subtitle2" className="leaderboard-section-label">
                    <TrendingUpIcon sx={{ mr: 0.8, fontSize: '1rem' }} />
                    Rankings (4+)
                </Typography>
            )}

            <TableContainer component={Paper} className="leaderboard-table-container">
                <Table stickyHeader>
                    <TableHead>
                        <TableRow className="table-header-row">
                            <TableCell className="leaderboard-cell-rank">#</TableCell>
                            <TableCell className="leaderboard-cell-user">Competitor</TableCell>
                            <TableCell className="leaderboard-cell-rank-badge">Rank</TableCell>
                            <TableCell className="leaderboard-cell-xp" align="right">XP</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading && accounts.length > 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                                    <CircularProgress size={24} />
                                </TableCell>
                            </TableRow>
                        )}

                        {accounts.map((account: any, index: number) => {
                            const level = getLevel(account.currentXP);
                            const rank = getRank(level);
                            const isCurrentUser = currentAccount.id === account.id;

                            return (
                                <TableRow
                                    key={account.id}
                                    className={`leaderboard-row ${isCurrentUser ? 'current-user' : ''}`}
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    <TableCell className="leaderboard-cell-rank">
                                        <Box className="rank-cell-content">
                                            <Typography className="rank-number">
                                                {account.globalRank}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell className="leaderboard-cell-user">
                                        <Box className="user-info">
                                            <AccountAvatar
                                                avatarUrl={account.profilePictureUrl}
                                                cssEffectStyle={account.cssEffectStyle}
                                                width={32}
                                                height={32}
                                            />
                                            <Typography
                                                className="leaderboard-username"
                                                onClick={() => navigate(`/accounts/profile/${account.username}`)}
                                            >
                                                {account.username}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell className="leaderboard-cell-rank-badge">
                                        <Box className="rank-badge-container">
                                            <Chip
                                                label={`Level ${level}`}
                                                size="small"
                                                variant="outlined"
                                                className="level-badge"
                                                sx={{
                                                    color: getRankColor(rank),
                                                    borderColor: `${getRankColor(rank)}40`,
                                                    backgroundColor: `${getRankColor(rank)}10`,
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell className="leaderboard-cell-xp" align="right">
                                        <Typography className="xp-value">
                                            {account.currentXP.toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default LeaderboardList;