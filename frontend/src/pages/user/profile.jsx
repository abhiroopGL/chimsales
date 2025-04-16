import React from "react";

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem("user")); // example structure

    return (
        <div className="min-h-screen p-6 bg-white text-black">
            <h2 className="text-3xl font-bold mb-6">Your Profile</h2>

            <div className="bg-gray-100 p-6 rounded-lg shadow max-w-md">
                <p className="mb-4"><strong>Name:</strong> {user?.name || "N/A"}</p>
                <p className="mb-4"><strong>Email:</strong> {user?.email || "N/A"}</p>
                <p className="mb-4"><strong>Phone:</strong> {user?.phone || "N/A"}</p>
            </div>
        </div>
    );
};

export default ProfilePage;
