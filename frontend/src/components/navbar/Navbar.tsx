import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';

import ByteStreakLogo from '../../ByteStreak.logo';
import Notifications from './Notifications';
import './Navbar.style.css';

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

                <Button 
                    className={`navbar-link-button ${currentPath === "/leaderboard" ? "navbar-selected-link" : ""}`}
                    onClick={() => navigate("/leaderboard")}
                    disableRipple>
                    Leaderboard
                </Button>

                <Button 
                    className={`navbar-link-button ${currentPath === "/people" ? "navbar-selected-link" : ""}`}
                    onClick={() => navigate("/social")}
                    disableRipple>
                    Social
                </Button>

                <Button 
                    className={`navbar-link-button ${currentPath === "/creator" ? "navbar-selected-link" : ""}`}
                    onClick={() => navigate("/creator")}
                    disableRipple>
                    Creator
                </Button>

                <Button 
                    className={`navbar-link-button ${currentPath === "/admin" ? "navbar-selected-link" : ""}`}
                    onClick={() => navigate("/admin")}
                    disableRipple>
                    Administration
                </Button>

                <Button 
                    className={`navbar-link-button ${currentPath === "/people" ? "navbar-selected-link" : ""}`}
                    onClick={() => navigate("/settings")}
                    disableRipple>
                    Settings
                </Button>

                <Notifications />

                {/* <Button
                    className={`navbar-link-button ${isMoreSelected ? "navbar-selected-link" : ""}`}
                    aria-controls={Boolean(moreAnchorEl) ? 'more-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={Boolean(moreAnchorEl) ? 'true' : undefined}
                    disableRipple
                    onClick={(event) => setMoreAnchorEl(event.currentTarget)}
                    >
                    More
                </Button>

                <Menu
                    id="more-menu"
                    anchorEl={moreAnchorEl}
                    open={Boolean(moreAnchorEl)}
                    onClose={() => setMoreAnchorEl(null)}
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
                    <MenuItem>
                        <Button 
                            className={`navbar-link-button ${currentPath === "/people" ? "navbar-selected-link" : ""}`}
                            onClick={() => navigate("/settings")}
                            disableRipple>
                            Settings
                        </Button>
                    </MenuItem>
                </Menu> */}
            </Box>
        </Box>
    )
}

export default Navbar;