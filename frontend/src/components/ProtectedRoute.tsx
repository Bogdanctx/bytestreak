import { useAccount } from "../hooks/useAccount";
import { Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from '@mui/material';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: account, isLoading } = useAccount();

    if (isLoading)  {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!account) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute;