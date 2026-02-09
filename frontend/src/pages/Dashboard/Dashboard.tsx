import { Box } from "@mui/material"
import "./Dashboard.style.css" 
import ProblemsSection from "../../features/Dashboard/ProblemsSection/ProblemsSection";
import AccountOverview from "../../features/Dashboard/AccountOverviewSection/AccountOverview";
import DailyChallanges from "../../features/Dashboard/DailyChallanges/DailyChallanges";
import { api } from "../../api"
import { useEffect } from "react";
import { useAccountContext } from "../../context/AccountContext";

function Dashboard() {
    const { account, setAccount } = useAccountContext();

    useEffect(() => {
        if(!account) {
            api.get("/auth/me")
                .then(response => {
                    if(response.status == 200) {
                        setAccount(response.data);
                    }
                    else if(response.status == 401) {
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
        }
    }, [account, setAccount]);

    if (!account) {
        return null;
    }

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