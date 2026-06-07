import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

function Loading() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress sx={{ color: 'var(--accent-main)' }} />
        </Box>
    )
}

export default Loading;