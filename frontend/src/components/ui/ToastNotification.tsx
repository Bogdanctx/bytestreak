import { Box, Typography, Divider } from "@mui/material";
import ByteStreakLogo from "../../ByteStreak.logo";
import { toast } from 'react-toastify';
import { Slide } from 'react-toastify';

type ToastType = "success" | "error" | "info" | "warning";

function ToastNotification(props: { message: string, type: ToastType }) {
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
        }}>
            <Box>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: 'white', 
                        fontSize: 14,
                        fontFamily: 'Roboto, sans-serif'
                    }}>
                    {props.message}
                </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 2, backgroundColor: 'rgba(255, 255, 255, 0.5)' }} />

            <Box minWidth={"fit-content"} height={1} borderRadius={1} display={"flex"} alignItems={"center"} justifyContent={"end"}>
                <ByteStreakLogo size={24} />
            </Box>
        </Box>
    )
}

const notify = (message: string, type: ToastType) => {
    toast(
        <ToastNotification message={message} type={type} />,
        {
            position: "top-right",
            hideProgressBar: true,
            icon: false,
            autoClose: 2500,
            closeOnClick: false,
            pauseOnFocusLoss: false,
            theme: 'colored',
            transition: Slide,
            type: type
        }
    );
}

export default notify;