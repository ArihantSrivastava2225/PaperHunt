import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const ProtectedRoute = () => {
    const location = useLocation();
    const { isAuthenticated, status } = useAppSelector((state) => state.auth);

    if(status==="idle" || status==="loading"){
        return <div className="min-h-screen grid place-items-center">Loading...</div>
    }

    if(!isAuthenticated){
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;