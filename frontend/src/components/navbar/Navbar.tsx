import { Box, Button } from '@mui/material'
import './Navbar.style.css'
import ByteStreakLogo from '../../ByteStreak.logo';

function Navbar() {
    return (
        <Box id="navbar-container">
             <Button id="navbar-logo-button">
                <ByteStreakLogo size={32} />
            </Button>
        </Box>
    )
}

export default Navbar;