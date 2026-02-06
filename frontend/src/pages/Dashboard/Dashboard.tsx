import { Box } from "@mui/material"
import "./Dashboard.style.css" 
import Navbar from "../../components/navbar/Navbar";
import ProblemsSection from "../../features/Dashboard/ProblemsSection/ProblemsSection";
import AccountOverview from "../../features/Dashboard/AccountOverviewSection/AccountOverview";
import { api } from "../../api"
import { useState, useEffect } from "react";

function Dashboard() {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        api.get("/auth/me")
            .then(response => {
                if(response.status == 200) {
                    setAccount(response.data);
                }
                else if(response.status == 401) {
                    // Redirect to login page
                    window.location.href = "/";
                }
                else {
                    window.location.href = "/";
                }
            })
            .catch(error => {
                console.error("Error fetching account info:", error);
                window.location.href = "/";
            });
    }, []);

    if(account === null) {
        return;
    }

    return (
        <Box id="dashboard-container">
            <Navbar />
            <Box id="dashboard-content">
                <ProblemsSection />
                <AccountOverview account={account} />
            </Box>
        </Box>
    )
}

export default Dashboard;