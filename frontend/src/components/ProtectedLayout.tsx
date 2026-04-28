import { Navigate, Outlet } from "react-router-dom";
import { useAccountContext } from "../context/AccountContext";
import Navbar from "./navbar/Navbar";
import { Box, CircularProgress } from '@mui/material';

function ProtectedLayout() {
    const { account, isLoading } = useAccountContext();

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