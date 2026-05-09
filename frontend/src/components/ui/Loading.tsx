import { Box, Typography } from '@mui/material';

function Loading() {
    return (
        <Box id="loading-container">
            <Typography variant="h5" className="loading-text">
                Loading...
            </Typography>
        </Box>
    )
}

export default Loading;