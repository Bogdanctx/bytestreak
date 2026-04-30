import { Box } from '@mui/material';

import AccountOverview from '../../features/Dashboard/AccountOverviewSection/AccountOverview';
import ActivitySection from '../../features/Dashboard/ActivitySection/ActivitySection';
import ProblemsSection from '../../features/Dashboard/ProblemsSection/ProblemsSection';
import './Dashboard.style.css';

function Dashboard() {
    return (
        <Box id="dashboard-container">
            <ProblemsSection />
            <Box display={"flex"} flexDirection={"column"} gap={"16px"} flex={1} maxWidth={"25%"}>
                <AccountOverview />
                <ActivitySection />
            </Box>
        </Box>
    )
}

export default Dashboard;