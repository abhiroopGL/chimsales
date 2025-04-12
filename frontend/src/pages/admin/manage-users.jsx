import AdminNavbar from "../../components/admin/admin-navbar.jsx";
import UserCard from "../../components/admin/user-card.jsx";
const ManageUsers = () => {
    const users = [{ id: 1, name: "Alice", email: "alice@mail.com" }];

    return (
        <>
            <AdminNavbar />
            <div className="p-6 bg-white min-h-screen">
                <h2 className="text-xl font-bold mb-4">Registered Users</h2>
                <div className="space-y-4">
                    {users.map(user => <UserCard key={user.id} user={user} />)}
                </div>
            </div>
        </>
    );
};

export default ManageUsers;
