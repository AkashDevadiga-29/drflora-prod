import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { is_authenticated, login } from '../endpoints/api';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    
    const get_authenticated = useCallback(async () => {
        try {
            const success = await is_authenticated();
            setIsAuthenticated(success);
        } catch {
            navigate('/');
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const login_user = async (username, password) => {
        const success = await login(username, password);
        if (success) {
            alert("Login Successful. Redirecting....");
            setIsAuthenticated(true);
            navigate('/');
        } else {
            alert("Incorrect Username or Password");
            navigate('/login');
        }
    };

    useEffect(() => {
        get_authenticated();
    }, [get_authenticated, location.pathname]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login_user }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);
export default useAuth;