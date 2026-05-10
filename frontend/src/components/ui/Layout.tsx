import { Box } from '@mui/material';
import Navbar from '../navbar/Navbar';
import { Outlet } from 'react-router-dom';
import './Layout.style.css';

function Layout() {
    return (
        <Box id="layout-container">
            <Box id="layout-navbar">
                <Navbar />
            </Box>
            <Box id="layout-content">
                <Outlet />
            </Box>
        </Box>
    )
}

export default Layout;