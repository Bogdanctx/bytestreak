import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

import Account from '../../features/Settings/AccountTab';
import './Settings.style.css';

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
                {selectedTab === "account" && <Account />}
                {/* {selectedTab === "appearance" && <Appearance />} */}
            </Box>

        </Box>
    )
}

export default Settings;