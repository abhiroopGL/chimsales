import React, { useState } from 'react';
import useAppNavigation from "../../hooks/useAppNavigation.jsx";
import {loginUser} from "../../api/authentication.js";

const AuthLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { goToSignup, goToDashboard } = useAppNavigation();

    const handleLogin = async (e) => {
        e.preventDefault()
        try{
            const response = await loginUser({email, password});
            console.log("Logged In successfully:", response);
            goToDashboard();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignup = () => {
        goToSignup();
    };

    const handleForgotPassword = () => {
        alert('Forgot Password Flow');
    };

    return (
        <div className="min-h-screen w-full bg-black flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg text-black transition-all duration-300">
                <h2 className="text-3xl font-bold text-center mb-6 uppercase tracking-widest">
                    WELCOME
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
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-black rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-black transition"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        className="w-full border border-black bg-white text-black py-2 rounded-md hover:bg-black hover:text-white active:scale-95 transition-all duration-200 font-semibold tracking-wide"
                    >
                        Login
                    </button>

                    {/* Forgot Password Link */}
                    <div className="text-right text-sm">
                        <button
                            onClick={handleForgotPassword}
                            className="text-black hover:underline transition"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Signup Message */}
                    <div className="text-center text-sm text-black mt-4">
                        <span>Don’t have an account?</span>
                    </div>

                    {/* Sign Up Button */}
                    <button
                        onClick={handleSignup}
                        className="w-full border border-black bg-white text-black py-2 rounded-md hover:bg-black hover:text-white active:scale-95 transition-all duration-200 font-semibold tracking-wide"
                    >
                        Sign Up
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

export default AuthLogin;
