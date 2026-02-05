import { Box } from "@mui/material"
import "./Dashboard.style.css" 
import Navbar from "../../components/navbar/Navbar";
import ProblemsSection from "../../features/Dashboard/ProblemsSection/ProblemsSection";
import AccountOverview from "../../features/Dashboard/AccountOverviewSection/AccountOverview";

function Dashboard() {
    return (
        <Box id="dashboard-container">
            <Navbar />
            <Box id="dashboard-content">
                <ProblemsSection />
                <AccountOverview />
            </Box>
        </Box>
    )
}

export default Dashboard;