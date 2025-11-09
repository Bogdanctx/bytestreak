import { Box, Button, Typography, Stack, Divider, useMediaQuery } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { Link } from 'react-router-dom';
import "../fonts.css";

function LandingPage() {
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md')); // true if md or larger

    return (
        <Box 
            height = {"100vh"} 
            bgcolor = {theme.palette.background.default}
        >
            <Stack 
                direction = {{ xs: 'column', sm: 'column', md: 'row' }} 
                height = {"100%"} 
                justifyContent = "space-evenly" 
                alignItems = "center" 
                spacing = {{ xs: 0, sm: 0, md: 5 }}
                divider = {isMdUp ? <Divider orientation = "vertical" sx = {{ height: "50vh", color: `${theme.palette.divider}` }} /> : null}
            >
                <Box>
                    <Typography 
                        variant = "h1" 
                        color = "textPrimary" 
                        fontFamily = "VT323" 
                        sx = {{
                            letterSpacing: "5px",
                            fontSize: 128
                        }}
                        gutterBottom
                    >
                        ByteStreak
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="h5" color="textPrimary" fontFamily={"Momo Trust Display"} gutterBottom>
                        Problem solving made collaborative and fun
                    </Typography>
                    <Stack direction = "row" spacing = {2}>
                        <Button 
                            component = {Link}
                            variant = "contained" 
                            fullWidth
                            color = "secondary"
                            sx = {{ fontFamily: "Momo Trust Display" }}
                            to = "/login"
                        >
                            Login
                        </Button>
                        <Button
                            component = {Link}
                            variant = "outlined" 
                            fullWidth
                            color = "secondary"
                            sx = {{ fontFamily: "Momo Trust Display" }}
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