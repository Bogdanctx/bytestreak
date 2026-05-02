import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';

import Navbar from './navbar/Navbar';
import { useAccount } from '../hooks/useAccount';

function ProtectedLayout() {
    const { data: account, isLoading } = useAccount();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh" width="100vw">
                <CircularProgress />
            </Box>
        );
    }
    
    if (!account) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <Navbar />
            <Box flex={1} overflow={"hidden"} padding={2}>
                <Outlet />
            </Box>
        </>
    );
}

export default ProtectedLayout;