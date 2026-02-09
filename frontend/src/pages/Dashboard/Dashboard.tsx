import { Box } from "@mui/material"
import "./Dashboard.style.css" 
import ProblemsSection from "../../features/Dashboard/ProblemsSection/ProblemsSection";
import AccountOverview from "../../features/Dashboard/AccountOverviewSection/AccountOverview";
import DailyChallanges from "../../features/Dashboard/DailyChallanges/DailyChallanges";

function Dashboard() {
    return (
        <Box id="dashboard-container">
            <ProblemsSection />
            <Box display={"flex"} flexDirection={"column"} gap={"16px"} flex={1} maxWidth={"25%"}>
                <AccountOverview />
                <DailyChallanges />
            </Box>
        </Box>
    )
}

export default Dashboard;