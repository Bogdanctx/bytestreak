import { Box } from "@mui/material"
import "./Dashboard.style.css" 
import ProblemsSection from "../../features/Dashboard/ProblemsSection/ProblemsSection";
import AccountOverview from "../../features/Dashboard/AccountOverviewSection/AccountOverview";
import DailyChallanges from "../../features/Dashboard/DailyChallanges/DailyChallanges";

import { useAccountContext } from "../../context/AccountContext";
import { useEffect } from "react";

function Dashboard() {
    const { account, isLoading } = useAccountContext();

    useEffect(() => {
        if (!isLoading && !account) {
            window.location.href = "/";
        }
    }, [account, isLoading]);

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