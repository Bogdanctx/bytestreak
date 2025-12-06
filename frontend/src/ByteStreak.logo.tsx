import { Box } from "@mui/material";
import { colors } from "./colors"; 

function ByteStreakLogo(props: {size: number}) {
    return (
        <Box 
            fontFamily={"VT323"} 
            fontSize={props.size}
            padding={0}
            margin={0}
        >
            
            <span style={{ color: colors.white }}>Byte</span>
            <span style={{ color: colors.emerald }}>Streak</span>
        </Box>
    );
};

export default ByteStreakLogo;