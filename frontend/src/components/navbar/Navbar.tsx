import { Box, Button, Menu, MenuItem, Popover } from '@mui/material'
import './Navbar.style.css'
import ByteStreakLogo from '../../ByteStreak.logo';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAccountContext } from '../../context/AccountContext';
import { api } from '../../api';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { type NotificationType } from '../../entities';
import Notifications from './Notifications';

function Navbar() {
    const [moreAnchorEl, setMoreAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const { account } = useAccountContext();

    const fetchNotifications = async () => {
        await api.get('/social/notifications')
                .then((response) => {
                    if (response.status === 200) {
                        console.log(response);
                        setNotifications(response.data);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
    }

    useEffect(() => {
        fetchNotifications();
        
        const interval = setInterval(() => {
            fetchNotifications();
        }, 60000);
    
        return () => clearInterval(interval);
    }, []);

    const currentPath = window.location.pathname;
    const isMoreSelected = currentPath === "/leaderboard" || currentPath === "/people";

    if (!account) {
        return;
    }

    return (
        <Box id="navbar-container">
             <Button id="navbar-logo-button" disableRipple>
                <ByteStreakLogo size={32} />
            </Button>

            <Box id="navbar-links">
                <Notifications />
                

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
                </Menu>
            </Box>
        </Box>
    )
}

export default Navbar;