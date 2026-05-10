import { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import QuizManagement from '../../features/Administration/QuizManagement/QuizManagement';
import './Administration.style.css';

export default function Administration() {
    const [activeTab, setActiveTab] = useState('quizzes');

    return (
        <Box id="admin-container">
            <Box id="admin-sidebar">
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontFamily: '"Momo Trust Display", sans-serif' }}>
                    Admin Panel
                </Typography>
                <Divider sx={{ backgroundColor: 'var(--bg-3)', marginBottom: 2 }} />
                <List>
                    <ListItemButton 
                        className="admin-menu-item"
                        selected={activeTab === 'quizzes'} 
                        onClick={() => setActiveTab('quizzes')}
                    >
                        <ListItemText primary="Quiz Management" />
                    </ListItemButton>
                    <ListItemButton 
                        className="admin-menu-item"
                        selected={activeTab === 'users'} 
                        onClick={() => setActiveTab('users')}
                    >
                        <ListItemText primary="Ban Users" />
                    </ListItemButton>
                </List>
            </Box>

            <Box id="admin-content-area">
                {activeTab === 'quizzes' && <QuizManagement />}
                {activeTab === 'users' && <Typography color="white">User management coming soon...</Typography>}
            </Box>
        </Box>
    );
}