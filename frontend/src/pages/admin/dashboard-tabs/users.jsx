
import {
    Eye,
    Edit,
    Trash2,
    Plus,
} from "lucide-react"

const UsersTab = ({data}) => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Users Management</h2>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{user.fullName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phoneNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email || "N/A"}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button className="text-blue-600 hover:text-blue-800" aria-label={`View user ${user.fullName}`}>
                                            <Eye size={16} />
                                        </button>
                                        <button className="text-green-600 hover:text-green-800" aria-label={`Edit user ${user.fullName}`}>
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem("users", user._id)}
                                            className="text-red-600 hover:text-red-800"
                                            aria-label={`Delete user ${user.fullName}`}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card/List View */}
            <div className="sm:hidden space-y-4">
                {data.users.map((user) => (
                    <div key={user._id} className="bg-white shadow rounded p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg">{user.fullName}</h3>
                            <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                                    }`}
                            >
                                {user.role}
                            </span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">{user.phoneNumber}</p>
                        <p className="text-sm text-gray-600 mb-1">{user.email || "N/A"}</p>
                        <p className="text-sm text-gray-600 mb-3">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>

                        <div className="flex gap-4">
                            <button className="text-blue-600 hover:text-blue-800" aria-label={`View user ${user.fullName}`}>
                                <Eye size={20} />
                            </button>
                            <button className="text-green-600 hover:text-green-800" aria-label={`Edit user ${user.fullName}`}>
                                <Edit size={20} />
                            </button>
                            <button
                                onClick={() => handleDeleteItem("users", user._id)}
                                className="text-red-600 hover:text-red-800"
                                aria-label={`Delete user ${user.fullName}`}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UsersTab;