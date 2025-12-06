import { Box, Button, List, Stack } from "@mui/material"
import { lighten, darken } from '@mui/material';
import { colors } from "../colors"
import "./Dashboard.style.css" 
import ByteStreakLogo from "../ByteStreak.logo";

function Dashboard() {
    return (
        <Box>
            <Box alignItems={"center"} display={"flex"} justifyContent={"center"} padding={2}>
                <Box id="navbar"
                    sx={{
                        backgroundColor: lighten(colors.night, 0.050),
                        borderRadius: 10,
                        width: "98vw",
                    }}
                >
                    <Stack 
                        direction="row" 
                        spacing={4} 
                        alignItems={"center"}
                        marginLeft={2}
                        marginTop={0}
                        marginBottom={0}
                        marginRight={2}
                    >
                        <Button sx={{
                            padding: 0,
                            minWidth: "min-content",
                            minHeight: "min-content",
                            backgroundColor: "transparent",
                            "&:hover": {
                                backgroundColor: "transparent",
                            }
                        }}>
                            <ByteStreakLogo size={32} />
                        </Button>


                        <Box sx={{ color: colors.white, fontSize: 12 }} width={"100%"} textAlign={"right"}>
                            <Button href="/dashboard" sx={{ color: "inherit", fontSize: "inherit", marginRight: 2 }} className="navbar-hover">
                                Dashboard
                            </Button>

                            <Button href="/problems" sx={{ color: "inherit", fontSize: "inherit", marginRight: 2 }} className="navbar-hover">
                                Problems
                            </Button>

                            <Button href="/friends" sx={{ color: "inherit", fontSize: "inherit" }} className="navbar-hover">
                                Friends
                            </Button>
                        </Box>

                    </Stack>
                </Box>
            </Box>

            <Box bgcolor="red">
                
            </Box>

        </Box>
    )
}

export default Dashboard;