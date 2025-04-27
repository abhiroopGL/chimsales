import { Link } from 'react-router-dom';

const AdminNavbar = () => (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <Link className="text-xl font-bold" to="/">User Dashboard</Link>
        <div className="space-x-4">
            <Link to="/admin" className="hover:underline">Dashboard</Link>
            <Link to="/admin/products" className="hover:underline">Products</Link>
            <Link to="/admin/users" className="hover:underline">Users</Link>
            <Link to="/admin/orders" className="hover:underline">Orders</Link>
        </div>
    </nav>
);

export default AdminNavbar;
