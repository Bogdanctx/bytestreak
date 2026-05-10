import { useState, useEffect } from 'react';
import { Box, Button, Divider, Slide, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

import ByteStreakLogo from '../../ByteStreak.logo';
import LoginForm from '../../features/Auth/Login/LoginForm';
import RegisterForm from '../../features/Auth/Register/RegisterForm';
import RecoverAccountForm from '../../features/Auth/Login/ForgotPasswordForm';
import './LandingPage.style.css';

const CODE_SNIPPETS = [
    "function solveChallenge(nums, target) {\n  let streak = 0;\n  // Level up your algorithms\n  return streak++;\n}",
    "SELECT username, rank \nFROM leaderboard \nORDER BY xp DESC \nLIMIT 10;",
    "public class ByteStreak {\n  public static void main() {\n    System.out.println(\"Dominate\");\n  }\n}",
    "def calculate_damage(base, multiplier):\n  critical_hit = True\n  return base * multiplier"
];

function LandingPage() {
    const [showAuthState, setShowAuthState] = useState<'login' | 'register' | 'recover-account' | null>(null);
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    
    const [displayedCode, setDisplayedCode] = useState("");
    const [snippetIndex, setSnippetIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentSnippet = CODE_SNIPPETS[snippetIndex];
        const typingSpeed = isDeleting ? 30 : 80;
        const pauseTime = isDeleting ? 500 : 2500;

        const handleTyping = () => {
            if (!isDeleting && displayedCode.length === currentSnippet.length) {
                setTimeout(() => setIsDeleting(true), pauseTime);
            } 
            else if (isDeleting && displayedCode.length === 0) {
                setIsDeleting(false);
                setSnippetIndex((prev) => (prev + 1) % CODE_SNIPPETS.length);
            } 
            else {
                const nextString = isDeleting 
                    ? currentSnippet.substring(0, displayedCode.length - 1)
                    : currentSnippet.substring(0, displayedCode.length + 1);
                setDisplayedCode(nextString);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayedCode, isDeleting, snippetIndex]);

    return (
        <Box id="landing-root">
            <Stack 
                id="landing-stack"
                direction={{ xs: 'column', md: 'row' }}
                divider={ isMdUp ? <Divider orientation="vertical" id="landing-page-stack-divider" flexItem /> : null }
                spacing={0}
            >
                <Box id="landing-hero-container">
                    <Box id="landing-code-background" className="blinking-cursor">
                        {displayedCode}
                    </Box>

                    <Box id="landing-logo-container">
                        <ByteStreakLogo size={isMdUp ? 160 : 100} />
                    </Box>
                </Box>

                <Box id="landing-auth-container">
                    <Box id="landing-auth-content">
                        
                        <Slide direction="down" in={showAuthState === 'login'} mountOnEnter unmountOnExit>
                            <Box>
                                <LoginForm setShowAuthState={setShowAuthState} />
                            </Box>
                        </Slide>

                        <Slide direction="down" in={showAuthState === 'register'} mountOnEnter unmountOnExit>
                            <Box>
                                <RegisterForm setShowAuthState={setShowAuthState} />
                            </Box>
                        </Slide>

                        <Slide direction="down" in={showAuthState === 'recover-account'} mountOnEnter unmountOnExit>
                            <Box>
                                <RecoverAccountForm setShowAuthState={setShowAuthState} />
                            </Box>
                        </Slide>

                        <Slide direction="up" in={showAuthState === null} mountOnEnter unmountOnExit>
                            <Box sx={{ textAlign: 'center', width: '100%', px: 4 }}>
                                <Typography id="landing-tagline" variant="h4">
                                    Compete. Solve. <span style={{ color: 'var(--accent-main)' }}>Level Up.</span>
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