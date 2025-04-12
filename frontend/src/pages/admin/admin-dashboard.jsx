import AdminNavbar from "../../components/admin/admin-navbar.jsx";

const AdminDashboard = () => {
    return (
        <>
            <AdminNavbar />
            <div className="min-h-screen bg-white text-black p-6">
                <h2 className="text-2xl font-bold mb-6">Welcome, Manager</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-black text-white p-4 rounded-xl shadow hover:scale-105 transition-all">
                        <h3 className="text-lg font-semibold">Manage Products</h3>
                        <p className="text-sm">Add, edit or delete chimney products</p>
                    </div>
                    <div className="bg-black text-white p-4 rounded-xl shadow hover:scale-105 transition-all">
                        <h3 className="text-lg font-semibold">User Management</h3>
                        <p className="text-sm">See all registered users</p>
                    </div>
                    <div className="bg-black text-white p-4 rounded-xl shadow hover:scale-105 transition-all">
                        <h3 className="text-lg font-semibold">Order Overview</h3>
                        <p className="text-sm">Track current and past orders</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
