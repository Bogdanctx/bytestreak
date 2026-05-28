import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Button,
    TextField,
    InputAdornment,
} from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import SearchIcon from '@mui/icons-material/Search';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { api } from '../../api';
import { useAccount } from '../../hooks/useAccount';
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/ui/Loading';
import LeaderboardPodium from './LeaderboardPodium';
import LeaderboardList from './LeaderboardList';
import './Leaderboard.style.css';

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
        getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.currentPage + 1 : null,
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

    if (!currentAccountQuerySuccess) return <Loading />;

    const loadedAccounts = leaderboardPages?.pages.flatMap((page) => page.accounts) || [];
    const isSearchMode = !!debouncedSearchValue;
    const topThree = loadedAccounts.slice(0, 3);
    const tableAccounts = isSearchMode ? loadedAccounts : loadedAccounts.slice(3);

    return (
        <Box className="leaderboard-container">
            <Box className="leaderboard-header-section">
                <Box className="leaderboard-header-content">
                    <Box className="leaderboard-header-text">
                        <Typography variant="h3" className="leaderboard-title">Leaderboard</Typography>
                        <Typography variant="body2" className="leaderboard-subtitle">
                            Compete globally and claim your place at the top
                        </Typography>
                    </Box>

                    <Box className="leaderboard-countdown">
                        <LocalFireDepartmentIcon className="countdown-icon" />
                        <Box className="countdown-content">
                            <Typography variant="body2" className="countdown-label">Days Left</Typography>
                            <Typography variant="h4" className="countdown-value">{daysLeft}</Typography>
                        </Box>
                    </Box>
                </Box>

                <TextField
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Search accounts..."
                    size="small"
                    className="leaderboard-search-field"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" sx={{ color: "var(--text-primary)" }} />
                                </InputAdornment>
                            )
                        }
                    }}
                />
            </Box>

            {/* Content State */}
            {isLoading && loadedAccounts.length === 0 ? (
                <Loading />
            ) : loadedAccounts.length === 0 ? (
                <Box className="leaderboard-empty-state">
                    <EmojiEventsIcon className="empty-state-icon" />
                    <Typography className="empty-state-text">No accounts found. Try a different search.</Typography>
                </Box>
            ) : (
                <>
                    {!isSearchMode && topThree.length > 0 && (
                        <LeaderboardPodium 
                            topThree={topThree} 
                            currentAccount={currentAccount} 
                            navigate={navigate} 
                        />
                    )}

                    <Box className="leaderboard-list-section">
                        <LeaderboardList 
                            accounts={tableAccounts} 
                            currentAccount={currentAccount} 
                            navigate={navigate} 
                            isLoading={isLoading}
                            isSearchMode={isSearchMode}
                        />

                        {hasNextPage && (
                            <Box className="load-more-rankings-box" sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    variant="outlined"
                                    className="load-more-button"
                                >
                                    {isFetchingNextPage ? <CircularProgress size={20} /> : 'Load More Rankings'}
                                </Button>
                            </Box>
                        )}
                    </Box>
                </>
            )}
        </Box>
    );
}

export default Leaderboard;