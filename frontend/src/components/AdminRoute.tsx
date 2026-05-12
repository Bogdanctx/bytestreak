import { Navigate, Outlet } from 'react-router-dom';
import { useAccount } from '../hooks/useAccount';
import Loading from './ui/Loading';

function AdminRoute({ children }: { children: React.ReactNode }) {
    const { data: account, isLoading } = useAccount();

    if (isLoading) {
        return <Loading />;
    }

    if (!account) {
        return <Navigate to="/" replace />;
    }

    if (account.role !== 'ADMIN') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            {children}
        </>
    )
}

export default AdminRoute;
