import { 
    Box,
    Typography,
    Button
} from "@mui/material";
import './Settings.style.css'
import { useState } from "react";
import Account from "../../features/Settings/AccountTab";
import { useAccountContext } from "../../context/AccountContext";

function Settings() {
    const [selectedTab, setSelectedTab] = useState("account");
    const { account, isLoading } = useAccountContext();

    if (isLoading) {
        return null;
    }

    if(!account) {
        window.location.href = "/";
        return null;
    }

    return (
        <Box id="settings-container">
            <Box className="settings-left-panel">
                <Typography className="settings-left-panel-title">
                    Settings
                </Typography>

                <Box width={"100%"} display={"flex"} flexDirection={"column"}>
                    <Button className="settings-menu-button" fullWidth>
                        Account
                    </Button>
                    <Button className="settings-menu-button" fullWidth>
                        Appearance
                    </Button>
                </Box>
            </Box>

            <Box id="settings-content">
                {selectedTab === "account" && <Account />}
            </Box>

        </Box>
    )
}

export default Settings;