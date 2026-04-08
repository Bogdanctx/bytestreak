import { Box, Button, Menu, MenuItem } from '@mui/material'
import './Navbar.style.css'
import ByteStreakLogo from '../../ByteStreak.logo';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

function Navbar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const [hasNotifications, setHasNotifications] = useState(true);

    const open = Boolean(anchorEl);
    const currentPath = window.location.pathname;
    const isMoreSelected = currentPath === "/leaderboard" || currentPath === "/people";


    const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    return (
        <Box id="navbar-container">
             <Button id="navbar-logo-button" disableRipple>
                <ByteStreakLogo size={32} />
            </Button>

            <Box id="navbar-links">
                <Button className='navbar-link-button' disableRipple>
                    {!hasNotifications && <NotificationsIcon className='navbar-logo-button' />}
                    {hasNotifications && <NotificationsActiveIcon className='navbar-logo-button' 
                                        sx = {{ color: 'var(--text-primary)' }} />}
                </Button>

                <Button 
                    className={`navbar-link-button ${currentPath === "/dashboard" ? "navbar-selected-link" : ""}`}
                    onClick={() => navigate("/dashboard")}
                    disableRipple>
                    Dashboard
                </Button>
                <Button 
                    className={`navbar-link-button ${currentPath === "/creator" ? "navbar-selected-link" : ""}`}
                    onClick={() => navigate("/creator")}
                    disableRipple>
                    Creator
                </Button>

                <Button
                    className={`navbar-link-button ${isMoreSelected ? "navbar-selected-link" : ""}`}
                    aria-controls={open ? 'more-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    disableRipple
                    onClick={handleMoreClick}
                    >
                    More
                </Button>

                <Menu
                    id="more-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    slotProps={{
                        paper: {
                            style: {
                                backgroundColor: '#1e1e1e',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }}
                >
                    <MenuItem>
                        <Button 
                            className={`navbar-link-button ${currentPath === "/leaderboard" ? "navbar-selected-link" : ""}`}
                            onClick={() => navigate("/leaderboard")}
                            disableRipple>
                            Leaderboard
                        </Button>
                    </MenuItem>
                    <MenuItem>
                        <Button 
                            className={`navbar-link-button ${currentPath === "/people" ? "navbar-selected-link" : ""}`}
                            onClick={() => navigate("/social")}
                            disableRipple>
                            Social
                        </Button>
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    )
}

export default Navbar;