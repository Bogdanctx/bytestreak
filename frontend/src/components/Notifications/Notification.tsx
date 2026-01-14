import { Box, Typography } from '@mui/material'; 

function Notification(props: { message: string, type: 'success' | 'error' | 'info' }) {
    return (
        <Box className="notification-box">
            <Typography>
                {props.message}
            </Typography>
        </Box>
    )
}

export default Notification;