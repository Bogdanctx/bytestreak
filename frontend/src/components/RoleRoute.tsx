import { Navigate, Outlet } from 'react-router-dom';
import { useAccount } from '../hooks/useAccount';
import Loading from './ui/Loading';

function RoleRoute({ allowedRoles, children }: { allowedRoles: string[], children?: React.ReactNode }) {
    const { data: account, isLoading } = useAccount();

    if (isLoading) return <Loading />;
    if (!account) return <Navigate to="/" replace />;
    
    if (!allowedRoles.includes(account.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}

export default RoleRoute;