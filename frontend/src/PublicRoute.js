import { Navigate } from 'react-router-dom';
import useAuth from './context/useAuth';
import { LoadingPage } from './LoadingPage';

export const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingPage/>;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};