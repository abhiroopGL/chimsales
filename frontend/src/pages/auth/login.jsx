import { useState } from 'react';
import useAppNavigation from "../../hooks/useAppNavigation.jsx";
import { loginUser } from "../../redux/slices/authSlice.jsx"
import { useDispatch } from "react-redux";
import { showNotification } from "../../redux/slices/notificationSlice.js";
const AuthLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { goToSignup, goToDashboard, goToAdmin } = useAppNavigation();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password })).then((data) => {
            if (data?.payload?.success) {
                dispatch(showNotification({
                    message: 'Login Successful',
                    type: 'success'
                }));
                goToAdmin();
            } else {
                dispatch(showNotification({
                    message: data.payload.message || 'Login Failed',
                    type: 'error'
                }));
            }
        });
    };

    const handleSignup = () => {
        goToSignup();
    };

    const handleForgotPassword = () => {
        alert('Forgot Password Flow');
    };

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-6 font-sans">
            <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-lg text-black transition-all duration-300">
                <h2 className="text-4xl font-bold text-center mb-8 uppercase tracking-widest">
                    WELCOME
                </h2>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-left">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3 border border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-left">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3 border border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full border border-black bg-white text-black py-3 rounded-lg hover:bg-black hover:text-white active:scale-95 transition-all duration-200 font-semibold tracking-wide"
                    >
                        Login
                    </button>
                </form>

                {/* <div className="flex justify-end mt-2 text-sm">
                    <button
                        onClick={handleForgotPassword}
                        className="text-black hover:underline transition"
                    >
                        Forgot password?
                    </button>
                </div>

                <div className="text-center text-sm text-black mt-8">
                    <span>Don’t have an account?</span>
                </div> */}

                {/* DISABLED SIGNUP PAGE FOR NOW AS WE ARE DOING BOOKING */}

                {/* <button
                    onClick={handleSignup}
                    className="w-full border border-black bg-white text-black py-3 rounded-lg hover:bg-black hover:text-white active:scale-95 transition-all duration-200 font-semibold tracking-wide mt-4"
                >
                    Sign Up
                </button> */}

                <div className="text-center text-xs text-gray-500 mt-10">
                    © {new Date().getFullYear()} Chimney Store. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default AuthLogin;
