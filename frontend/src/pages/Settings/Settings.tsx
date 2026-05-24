import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

import './Settings.style.css';
import AccountTab from '../../features/Settings/AccountTab';
import AppearanceTab from '../../features/Settings/AppearanceTab'; 

function Settings() {
    const [selectedTab, setSelectedTab] = useState("account");

    return (
        <Box id="settings-container">
            <Box className="settings-left-panel">
                <Typography className="settings-left-panel-title">
                    Settings
                </Typography>

                <Box width={"100%"} display={"flex"} flexDirection={"column"}>
                    <Button className={`settings-menu-button ${selectedTab === 'account' ? 'active' : ''}`}
                            onClick={() => setSelectedTab("account")}
                            fullWidth>
                        Account
                    </Button>
                    <Button className={`settings-menu-button ${selectedTab === 'appearance' ? 'active' : ''}`}
                            onClick={() => setSelectedTab("appearance")}
                            fullWidth>
                        Appearance
                    </Button>
                </Box>
            </Box>

            <Box id="settings-content">
                {selectedTab === "account" && <AccountTab />}
                {selectedTab === "appearance" && <AppearanceTab />}
            </Box>

        </Box>
    )
}

export default Settings;