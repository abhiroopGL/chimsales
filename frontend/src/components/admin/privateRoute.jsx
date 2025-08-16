import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // or context/state
import LoadingSpinner from "../common/LoadingSpinner"; 

const PrivateRoute = ({ children, role }) => {
    const { isAuthenticated, user, isLoading } = useSelector((state) => state.authorization);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        // Not logged in -> go to login
        return <Navigate to="/login" replace />;
    }

    if (role && user?.role !== role) {
        // Logged in but not authorized -> block access
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
