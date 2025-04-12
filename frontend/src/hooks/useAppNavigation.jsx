import { useNavigate } from 'react-router-dom';

const useAppNavigation = () => {
    const navigate = useNavigate();

    return {
        goToLogin: () => navigate('/login'),
        goToSignup: () => navigate('/signup'),
        goToHome: () => navigate('/'),
        goToDashboard: () => navigate('/dashboard'),
        goToReview: () => navigate('/review'),
        // Add more routes as needed
    };
};

export default useAppNavigation;
