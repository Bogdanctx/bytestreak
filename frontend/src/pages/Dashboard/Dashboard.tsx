import { Box } from "@mui/material"
import "./Dashboard.style.css" 
import Navbar from "../../components/navbar/Navbar";
import ProblemsSection from "../../features/Dashboard/ProblemsSection/ProblemsSection";

function Dashboard() {
    return (
        <Box id="dashboard-container">
            <Navbar />
            <Box id="dashboard-content">
                <ProblemsSection />
            </Box>
        </Box>
    )
}

export default Dashboard;