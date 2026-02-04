import { Box, Button, Typography, Stack, Divider } from '@mui/material';
import { Slide } from '@mui/material';
import ByteStreakLogo from "../../ByteStreak.logo"
import { useState } from 'react';
import LoginForm from '../../features/Auth/Login/LoginForm';
import RegisterPage from '../register-page/RegisterPage';
import '../../fonts.css';
import './LandingPage.style.css'

function LandingPage() {
    const [showAuthState, setShowAuthState] = useState<'login' | 'register' | null>(null);

    return (
        <Box id="landing-root">
            <Stack 
                id="landing-stack"
                direction={{ xs: 'column', md: 'row' }}
                divider={<Divider orientation="vertical"  id="landing-page-stack-divider" flexItem />}
                spacing={2}
            >
                <Box id="landing-logo-container">
                    <ByteStreakLogo size={120} />
                </Box>
                <Box id="landing-auth-container" sx={{ overflow: 'hidden' }}> {/* Added overflow hidden to prevent scrollbars during animation */}
                    <Box id="landing-auth-content">
                        <Slide direction="down" in={showAuthState === 'login'} mountOnEnter unmountOnExit>
                            <Box>
                                <LoginForm setShowAuthState={setShowAuthState} />
                            </Box>
                        </Slide>

                        <Slide direction="down" in={showAuthState === 'register'} mountOnEnter unmountOnExit>
                            <Box>
                                <RegisterPage setShowAuthState={setShowAuthState} />
                            </Box>
                        </Slide>

                        <Slide direction="up" in={showAuthState === null} mountOnEnter unmountOnExit>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography id="landing-tagline" variant="h5">
                                    Problem solving made collaborative and fun
                                </Typography>
                                
                                <Stack direction="row" spacing={2}>
                                    <Button id="landing-login-btn" onClick={() => setShowAuthState('login')} variant="contained" fullWidth>
                                        Login
                                    </Button>

                                    <Button id="landing-signup-btn" onClick={() => setShowAuthState('register')} variant="outlined" fullWidth>
                                        Sign Up
                                    </Button>
                                </Stack>
                            </Box>
                        </Slide>
                    </Box>
                </Box>
            </Stack>
        </Box>
    )
}
export default LandingPage;