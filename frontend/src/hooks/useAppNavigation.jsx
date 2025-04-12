import { useNavigate } from 'react-router-dom';

const useAppNavigation = () => {
    const navigate = useNavigate();

    return {
        goToLogin: () => navigate('/login'),
        goToSignup: () => navigate('/signup'),
        goToHome: () => navigate('/'),
        goToDashboard: () => navigate('/dashboard'),
        // Add more routes as needed
    };
};

export default useAppNavigation;
