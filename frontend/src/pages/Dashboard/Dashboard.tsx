import { Box } from '@mui/material';

import AccountOverview from '../../features/Dashboard/AccountOverviewSection/AccountOverview';
import ActivitySection from '../../features/Dashboard/ActivitySection/ActivitySection';
import ProblemsSection from '../../features/Dashboard/ProblemsSection/ProblemsSection';
import './Dashboard.style.css';

function Dashboard() {
    return (
        <Box id="dashboard-container">
            <Box width={"auto"} flex={1}>
                <ProblemsSection />
            </Box>
            <Box display={"flex"} flexDirection={"column"} gap={"16px"}>
                <AccountOverview />
                <ActivitySection />
            </Box>
        </Box>
    )
}

export default Dashboard;