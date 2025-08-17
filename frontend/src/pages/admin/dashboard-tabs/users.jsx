import { useState, useEffect, useCallback } from "react";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import axios from "axios";
import SearchBar from "../../../components/admin/searchBar";

// Debounce helper
function useDebounce(value, delay) {
    const [debouncedVal, setDebouncedVal] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedVal(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedVal;
}

const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebounce(search, 400);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/admin/users", {
                params: { search: debouncedSearch, page, limit },
            });
            if (res.data.success) {
                setUsers(res.data.users);
                setTotalPages(res.data.totalPages);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, page, limit]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDeleteItem = async (userId) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`/api/admin/users/${userId}`);
            fetchUsers(); // refresh after delete
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Users Management</h2>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            <div className="mb-4 py-4 px-6 bg-white rounded-lg shadow">
                <div className="mb-4">
                    <SearchBar
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        placeholder="Search by name, phone, or email..."
                        className="w-full max-w-xl sm:max-w-2xl py-3 px-4 text-lg"
                    />
                </div>

            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-left whitespace-nowrap font-medium text-gray-900">
                                        {user.fullName}
                                    </td>
                                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-600">
                                        {user.phoneNumber}
                                    </td>
                                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-600">
                                        {user.email || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-left whitespace-nowrap">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === "admin"
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-green-100 text-green-800"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-left whitespace-nowrap text-sm text-gray-600">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                aria-label={`View user ${user.fullName}`}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-800"
                                                aria-label={`Edit user ${user.fullName}`}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(user._id)}
                                                className="text-red-600 hover:text-red-800"
                                                aria-label={`Delete user ${user.fullName}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center gap-4">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="self-center">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UsersTab;
