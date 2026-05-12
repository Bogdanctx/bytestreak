import { useAccount } from "../hooks/useAccount";
import { Navigate } from "react-router-dom";
import Loading from "./ui/Loading";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { data: account, isLoading } = useAccount();

    if (isLoading)  {
        return <Loading />;
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