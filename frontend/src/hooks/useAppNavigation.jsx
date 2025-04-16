import { useNavigate } from 'react-router-dom';

const useAppNavigation = () => {
    const navigate = useNavigate();

    return {
        goToLogin: () => navigate('/login'),
        goToSignup: () => navigate('/signup'),
        goToDashboard: () => navigate('/'),
        goToReview: () => navigate('/review'),
        goToProfile: () => navigate('/profile'),
        // Add more routes as needed
    };
};

export default useAppNavigation;
