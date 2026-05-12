import { Navigate } from 'react-router-dom';
import { useAccount } from '../hooks/useAccount';
import Loading from './ui/Loading';

function ModeratorRoute({ children }: { children: React.ReactNode }) {
    const { data: account, isLoading } = useAccount();

    if (isLoading) {
        return <Loading />;
    }

    if (!account) {
        return <Navigate to="/" replace />;
    }

    const allowedRoles = ['ADMIN', 'MODERATOR'];

    if (!allowedRoles.includes(account.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            {children}
        </>
    ); 
}

export default ModeratorRoute;