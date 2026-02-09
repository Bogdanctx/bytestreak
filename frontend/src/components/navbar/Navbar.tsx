import { Box, Button } from '@mui/material'
import './Navbar.style.css'
import ByteStreakLogo from '../../ByteStreak.logo';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    return (
        <Box id="navbar-container">
             <Button id="navbar-logo-button">
                <ByteStreakLogo size={32} />
            </Button>

            <Box id="navbar-links">
                <Button className="navbar-link-button" onClick={() => navigate("/dashboard")}>
                    Dashboard
                </Button>
                <Button className="navbar-link-button" onClick={() => navigate("/")}>
                    Problems
                </Button>
            </Box>
        </Box>
    )
}

export default Navbar;