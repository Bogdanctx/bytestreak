import { Box, Typography, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import './Administration.style.css';

export default function Administration() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box id="admin-container">
            <Box id="admin-sidebar">
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontFamily: "Momo Trust Display" }}>
                    Admin Panel
                </Typography>
                <Divider sx={{ backgroundColor: 'var(--bg-3)', marginBottom: 2 }} />
                <List>
                    <ListItemButton 
                        className="admin-menu-item"
                        selected={location.pathname.includes('/manage-quizzes')} 
                        onClick={() => navigate("/admin/manage-quizzes")}
                    >
                        <ListItemText primary="Manage quizzes" />
                    </ListItemButton>
                    <ListItemButton 
                        className="admin-menu-item"
                        selected={location.pathname.includes('/manage-users')} 
                        onClick={() => navigate("/admin/manage-users")}
                    >
                        <ListItemText primary="Manage users" />
                    </ListItemButton>
                    <ListItemButton 
                        className="admin-menu-item"
                        selected={location.pathname.includes('/manage-reports')} 
                        onClick={() => navigate("/admin/manage-reports")}
                    >
                        <ListItemText primary="Manage reports" />
                    </ListItemButton>
                </List>
            </Box>

            <Box id="admin-content-area">
                <Outlet />
            </Box>
        </Box>
    );
}