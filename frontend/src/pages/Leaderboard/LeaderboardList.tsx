import { Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getLevel, getRank, getRankColor } from '../../utils/rankUtils';
import AccountAvatar from '../../components/ui/AccountAvatar';
import './Leaderboard.style.css';
import type { IAccount } from '../../types/account.types';

interface ILeaderboardListProps {
    accounts: IAccount[];
    currentAccount: IAccount;
}

function LeaderboardList({ accounts, currentAccount }: ILeaderboardListProps) {
    const navigate = useNavigate();

    return (
        <Box className="leaderboard-content">
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