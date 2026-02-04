import { Box } from "@mui/material"
import "./Dashboard.style.css" 
import Navbar from "../../components/navbar/Navbar";
import CodingProblems from "../../components/dashboard/coding-problems-section/CodingProblems";

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