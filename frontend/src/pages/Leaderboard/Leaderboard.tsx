import { useState, useEffect } from 'react';
import {
    Box,
    Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { api } from '../../api';
import { useAccount } from '../../hooks/useAccount';
import Loading from '../../components/ui/Loading';
import LeaderboardPodium from './LeaderboardPodium';
import LeaderboardList from './LeaderboardList';
import './Leaderboard.style.css';
import type { IAccount } from '../../types/account.types';
import { getRank } from '../../utils/rankUtils';

function Leaderboard() {
    const { data: currentAccount, isSuccess: currentAccountQuerySuccess } = useAccount();
    const [daysLeft, setDaysLeft] = useState<number>(0);
    const { data: leaderboardAccounts, isSuccess: leaderBoardAccountsSuccess } = useQuery<IAccount[]>({
        queryKey: ['leaderboard'],
        queryFn: async () => {
            const response = await api.get('/accounts/leaderboard');
            return response.data;
        }
    });

    useEffect(() => {
        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const remaining = Math.ceil((lastDayOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        setDaysLeft(Math.max(0, remaining));
    }, []);

    if (!currentAccountQuerySuccess || !leaderBoardAccountsSuccess) {
        return <Loading />;
    }

    const topThree = leaderboardAccounts.slice(0, 3);
    
    return (
        <Box className="leaderboard-container">
            <Box className="leaderboard-header-content">

                <Box>
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

            <Typography className="current-rank-label" align="center">
                {currentAccount.username}, you are #{currentAccount.globalRank} globally
            </Typography>
            
            <LeaderboardPodium topThree={topThree} currentAccount={currentAccount} />

            <Box className="leaderboard-list-section">
                <LeaderboardList accounts={leaderboardAccounts.slice(3)} currentAccount={currentAccount}/>
            </Box>
        </Box>
    );
}

export default Leaderboard;