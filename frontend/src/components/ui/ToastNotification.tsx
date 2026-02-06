import { Box, Typography } from "@mui/material";
import ByteStreakLogo from "../../ByteStreak.logo"; // Adjust path as needed
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
                        fontSize: 18,
                        fontFamily: 'Roboto, sans-serif'
                    }}>
                    {props.message}
                </Typography>
            </Box>

            <Box sx={{ 
                width: '1px', 
                height: '24px', 
                bgcolor: 'rgba(255,255,255,0.2)', 
                mx: 2
            }} />

            <Box>
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
            autoClose: 2000,
            closeOnClick: false,
            pauseOnFocusLoss: false,
            transition: Slide,
            theme: 'colored',

            type: type
        }
    );
}

export default notify;