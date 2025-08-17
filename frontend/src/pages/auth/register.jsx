import { useState } from 'react';
import useAppNavigation from "../../hooks/useAppNavigation.jsx";
import { registerUser } from "../../redux/slices/authSlice.jsx";
import {useDispatch} from "react-redux";
import {showNotification} from "../../redux/slices/notificationSlice.js";

const AuthRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { goToLogin, goToDashboard } = useAppNavigation();
    const dispatch = useDispatch();

    // const handleSignup = async (e) => {
    //     e.preventDefault();
    //     try{
    //         if (password !== confirmPassword) {
    //             dispatch(showNotification({
    //                 message: 'Passwords do not match',
    //                 type: 'error'
    //             }));
    //         } else {
    //             dispatch(registerUser({email, password}));
    //             dispatch(showNotification({
    //                 message: 'User Registered Successfully',
    //                 type: 'success'
    //             }));
    //             goToLogin();
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const handleLoginRedirect = () => {
        // goToLogin();
    };

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg text-black transition-all duration-300">
                <h2 className="text-3xl font-bold text-center mb-6 uppercase tracking-widest">
                    Join Us
                </h2>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-left mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-black rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-left mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-black rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-left mb-1">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-black rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button
                        onClick={handleSignup}
                        className="w-full border border-black bg-white text-black py-2 rounded-md hover:bg-black hover:text-white active:scale-95 transition-all duration-200 font-semibold tracking-wide"
                    >
                        Sign Up
                    </button>

                    {/* Already have account message */}
                    <div className="text-center text-sm text-black mt-4">
                        <span>Already have an account?</span>
                    </div>

                    {/* Redirect to log in */}
                    <button
                        onClick={handleLoginRedirect}
                        className="w-full border border-black bg-white text-black py-2 rounded-md hover:bg-black hover:text-white active:scale-95 transition-all duration-200 font-semibold tracking-wide"
                    >
                        Login
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 mt-6">
                    © {new Date().getFullYear()} Chimney Store. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default AuthRegister;
