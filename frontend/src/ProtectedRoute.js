import { Navigate } from 'react-router-dom';
import useAuth from './context/useAuth';
import { LoadingPage } from './LoadingPage';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingPage/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};