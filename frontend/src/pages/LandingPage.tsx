import { Box, Button, Typography, Stack, Divider, useMediaQuery } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { Link } from 'react-router-dom';
import "../fonts.css";
import { colors } from '../colors';
import ByteStreakLogo from "../ByteStreak.logo"


function LandingPage() {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Box 
            height = {"100vh"}
            bgcolor={ colors.night }
        >
            <Stack 
                direction = {{ xs: 'column', sm: 'column', md: 'row' }} 
                height = {"100%"} 
                justifyContent = "space-evenly" 
                alignItems = "center" 
                spacing = {{ xs: 0, sm: 0, md: 5 }}
                divider = {isMdUp ? <Divider orientation = "vertical" sx = {{ height: "50vh", color: "gray" }} /> : null}
            >
                <Box>
                    <ByteStreakLogo size={128} />
                </Box>
                <Box>
                    <Typography 
                        variant="h5" 
                        fontFamily={"Momo Trust Display"} 
                        sx={{
                            color: `${colors.white}`
                        }}
                        gutterBottom>
                        Problem solving made collaborative and fun
                    </Typography>
                    <Stack direction = "row" spacing = {2}>
                        <Button 
                            component = {Link}
                            variant = "contained" 
                            fullWidth
                            sx = {{ 
                                backgroundColor: colors.emerald, 
                                fontFamily: "Momo Trust Display" 
                            }}
                            to = "/login"
                        >
                            Login
                        </Button>
                        <Button
                            component = {Link}
                            variant = "outlined" 
                            fullWidth
                            sx = {{ 
                                fontFamily: "Momo Trust Display",
                                color: colors.white,
                                borderColor: colors.yellow,
                            }}
                            to = "/signup"
                        >
                            Sign Up
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}

export default LandingPage;