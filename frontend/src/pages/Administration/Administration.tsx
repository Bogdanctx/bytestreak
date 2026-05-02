import { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import ManageQuizzes from '../../features/Administration/ManageQuizzes/ManageQuizzes';
import './Administration.style.css';

function Administration() {
    const [currentTab, setCurrentTab] = useState(0);

    return (
        <Box id="admin-container">
            <Typography variant="h4" className="admin-title">Administration</Typography>
            
            <Tabs 
                value={currentTab} 
                onChange={(_, newValue) => setCurrentTab(newValue)}
                className="admin-tabs"
            >
                <Tab label="Manage Quizzes" />
                {/* Add future tabs here */}
            </Tabs>

            <Box className="admin-tab-panel">
                {currentTab === 0 && <ManageQuizzes />}
            </Box>
        </Box>
    );
}

export default Administration;