import { Outlet } from "react-router-dom";
import { useAccountContext } from "../context/AccountContext";

function ProtectedRoute() {
    const { account, isLoading } = useAccountContext();

    if (isLoading) {
        return null;
    }
    
    if (!account) {
        window.location.href = "/";
        return null;
    }

    return <Outlet />;
}

export default ProtectedRoute;