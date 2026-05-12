import { Navigate, Outlet } from 'react-router-dom';
import { useAccount } from '../hooks/useAccount';
import Loading from './ui/Loading';

function CreatorRoute() {
    const { data: account, isLoading } = useAccount();

    if (isLoading) {
        return <Loading />;
    }

    if (!account) {
        return <Navigate to="/" replace />;
    }

    const allowedRoles = ['ADMIN', 'MODERATOR', 'CREATOR'];

    if (!allowedRoles.includes(account.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />; 
}

export default CreatorRoute;