import { Box, Button } from '@mui/material'
import './Navbar.style.css'
import ByteStreakLogo from '../../ByteStreak.logo';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const currentPath = window.location.pathname;

    return (
        <Box id="navbar-container">
             <Button id="navbar-logo-button" disableRipple>
                <ByteStreakLogo size={32} />
            </Button>

            <Box id="navbar-links">
                <Button 
                    className={`navbar-link-button ${currentPath === "/dashboard" ? "navbar-selected-link" : ""}`}
                    onClick={() => navigate("/dashboard")}
                    disableRipple>
                    Dashboard
                </Button>
                {/* <Button className="navbar-link-button" onClick={() => navigate("/")} disableRipple>
                    Problems
                </Button> */}
            </Box>
        </Box>
    )
}

export default Navbar;