import { useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import useAppNavigation from "../../hooks/useAppNavigation.jsx"
import { logoutUser } from "../../api/authentication.js"
import { logoutSuccess } from "../../redux/slices/authSlice.jsx"

const LoggedInUser = () => {
    const isLoggedIn = useSelector((state) => state.authorization.isAuthenticated);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const {goToLogin, goToProfile} = useAppNavigation();
    const handleProfile = () => {
        goToProfile()
    }
    const dispatch = useDispatch();

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await logoutUser();
            console.log(response);
            dispatch(logoutSuccess());
        } catch (error) {
            console.error(error);

        }
    }

    return (
        <div className="flex items-center ml-4 relative">
        {isLoggedIn && (
            <>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <img
                        src="/user-icon.svg" // use any user icon here
                        alt="User"
                        className="w-8 h-8 rounded-full border border-black"
                    />
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white border rounded shadow-md text-sm z-50">
                        <button
                            onClick={handleProfile}
                            className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                        >
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </>
        )}
            {
                !isLoggedIn && (
                    <button
                        onClick={() => goToLogin()}
                        className="px-4 py-1 border rounded-full transition-colors duration-300 whitespace-nowrap text-sm md:text-base font-medium hover:bg-black hover:text-white active:scale-95">
                        Login
                    </button>
                )
            }
        </div>
    )
}

export default LoggedInUser;