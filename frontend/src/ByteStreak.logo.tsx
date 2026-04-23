import { Box } from "@mui/material";

function ByteStreakLogo(props: {size: number}) {
    return (
        <Box 
            fontFamily={"VT323"} 
            fontSize={props.size}
            padding={0}
            margin={0}
        >
            
            <span style={{ color: "var(--text-primary)" }}>Byte</span>
            <span style={{ color: "var(--accent-main)" }}>Streak</span>
        </Box>
    );
};

export default ByteStreakLogo;