import { Box } from "@mui/material"
import "./Dashboard.style.css" 
import ByteStreakLogo from "../../ByteStreak.logo";
import Navbar from "../../components/navbar/Navbar";
import AccountDetails from "../../components/dashboard/AccountDetails";
import DailyChallanges from "../../components/dashboard/DailyChallanges";
import CodingProblems from "../../components/dashboard/CodingProblems";

function Dashboard() {
    return (
        <Box id="dashboard-container">
            <Navbar />
            <Box id="dashboard-content">
                <CodingProblems />
            </Box>
        </Box>
    )
}

export default Dashboard;