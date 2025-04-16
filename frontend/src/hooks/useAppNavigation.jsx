import { useNavigate } from 'react-router-dom';

const useAppNavigation = () => {
    const navigate = useNavigate();

    return {
        goToLogin: () => navigate('/login'),
        goToSignup: () => navigate('/signup'),
        goToDashboard: () => navigate('/'),
        goToReview: () => navigate('/review'),
        // Add more routes as needed
    };
};

export default useAppNavigation;
