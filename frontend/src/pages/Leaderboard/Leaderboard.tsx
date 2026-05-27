import { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Paper,
    Button,
    Divider,
    TextField,
    InputAdornment
} from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SearchIcon from '@mui/icons-material/Search';

import { api } from '../../api';
import { useAccount } from '../../hooks/useAccount';
import { useNavigate } from 'react-router-dom';
import { getLevel, getRank, getRankColor } from '../../utils/rankUtils';
import Loading from '../../components/ui/Loading';
import './Leaderboard.style.css';
import AccountAvatar from '../../components/ui/AccountAvatar';

function Leaderboard() {
    const navigate = useNavigate();
    const { data: currentAccount, isSuccess: currentAccountQuerySuccess } = useAccount();
    const [daysLeft, setDaysLeft] = useState<number>(0);
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
    const { data: leaderboardPages, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['leaderboard', debouncedSearchValue],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await api.get('/accounts/leaderboard', {
                params: {
                    query: debouncedSearchValue || undefined,
                    page: pageParam,
                },
            });

            return response.data;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.hasNext) {
                return lastPage.currentPage + 1;
            }
            return null;
        },
        initialPageParam: 0
    });

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedSearchValue(searchValue.trim());
        }, 350);

        return () => window.clearTimeout(timeout);
    }, [searchValue]);

    useEffect(() => {
        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const remaining = Math.ceil((lastDayOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        setDaysLeft(Math.max(0, remaining));
    }, []);

    if (!currentAccountQuerySuccess) {
        return <Loading />;
    }

    const loadedAccounts = leaderboardPages?.pages.flatMap((page) => page.accounts) || [];

    return (
        <Box className="leaderboard-container">
            <Box className="leaderboard-header">
                <Box>
                    <Typography variant="h4" className="leaderboard-title">
                        Leaderboard
                    </Typography>
                    <Typography variant="body2" className="leaderboard-subtitle">
                        Compete and climb the ranks
                    </Typography>
                </Box>

                <Box className="leaderboard-countdown">
                    <LocalFireDepartmentIcon className="countdown-icon" />
                    <Box className="countdown-content">
                        <Typography variant="body2" className="countdown-label">
                            Days Left in Month
                        </Typography>
                        <Typography variant="h5" className="countdown-value">
                            {daysLeft}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box className="leaderboard-toolbar">
                <TextField
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search accounts by username"
                    fullWidth
                    size="small"
                    className="leaderboard-search-field"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: "white" }} />
                                </InputAdornment>
                            )
                        }
                    }}
                />
            </Box>

            <Divider sx={{ borderColor: 'var(--bg-3)', margin: '16px 0' }} />

            <Box className="leaderboard-content">
                {isLoading && loadedAccounts.length === 0 ? (
                    <Loading />
                ) : (
                    <TableContainer component={Paper} className="leaderboard-table-container">
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell className="leaderboard-cell-rank">#</TableCell>
                                    <TableCell className="leaderboard-cell-user">User</TableCell>
                                    <TableCell className="leaderboard-cell-rank-badge">Level</TableCell>
                                    <TableCell className="leaderboard-cell-xp" align="right">
                                        XP
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading && loadedAccounts.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 1 }}>
                                            <CircularProgress size={24} />
                                        </TableCell>
                                    </TableRow>
                                )}

                                {loadedAccounts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" className="leaderboard-empty-cell">
                                            <Typography className="leaderboard-empty-text">
                                                No accounts found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {loadedAccounts.map((account) => {
                                    const level = getLevel(account.currentXP);
                                    const rank = getRank(level);
                                    const rankColor = getRankColor(rank);

                                    return (
                                        <TableRow
                                            key={account.id}
                                            className={`leaderboard-row ${currentAccount.id === account.id ? 'current-user' : ''}`}
                                        >
                                            <TableCell className="leaderboard-cell-rank">
                                                <Typography className="rank-number">
                                                    {account.globalRank}
                                                </Typography>
                                            </TableCell>
                                            <TableCell className="leaderboard-cell-user">
                                                <Box className="user-info">
                                                    <AccountAvatar avatarUrl={account.profilePictureUrl} cssEffectStyle={account.cssEffectStyle} width={28} height={28} />
                                                
                                                    <Typography className="leaderboard-username"
                                                                onClick={() => navigate(`/accounts/profile/${account.username}`)}
                                                    >
                                                        {account.username}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell className="leaderboard-cell-rank-badge">
                                                <Typography className="rank-name" sx={{ color: rankColor }}>
                                                    Level {level} • {rank}
                                                </Typography>
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
                )}

                {hasNextPage && (
                    <Box className="load-more-container">
                        <Button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            variant="outlined"
                            className="load-more-button"
                        >
                            {isFetchingNextPage ? <CircularProgress size={20} /> : 'Load More'}
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default Leaderboard;