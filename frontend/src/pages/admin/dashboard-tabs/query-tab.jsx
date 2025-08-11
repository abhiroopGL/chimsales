import { useState } from "react";
import axiosInstance from "../../../api/axios-instance";

const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    "In Process": "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
};

const QueryTab = ({ data, fetchDashboardData }) => {
    const [updatingId, setUpdatingId] = useState(null);

    const handleStatusChange = async (queryId, newStatus) => {
        try {
            setUpdatingId(queryId);
            const res = await axiosInstance.put(`/api/queries/${queryId}/status`, {
                status: newStatus,
            });

            if (!res.data.success) {
                alert(res.data.message || "Failed to update status");
            } else {
                fetchDashboardData();
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Server error while updating status");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Customer Queries</h2>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {data.queries.map((query) => (
                            <tr key={query._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{query.fullName}</td>
                                <td className="px-6 py-4">{query.phoneNumber}</td>
                                <td className="px-6 py-4">{query.subject}</td>
                                <td className="px-6 py-4">{query.message}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[query.status] || ""}`}>
                                        {query.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={query.status}
                                        onChange={(e) => handleStatusChange(query._id, e.target.value)}
                                        disabled={updatingId === query._id}
                                        className="border rounded px-2 py-1 text-sm"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Process">In Process</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4">
                {data.queries.map((query) => (
                    <div key={query._id} className="bg-white shadow rounded p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">{query.fullName}</h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[query.status] || ""}`}>
                                {query.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">📞 {query.phoneNumber}</p>
                        <p className="text-sm text-gray-600 mb-1">📌 {query.subject}</p>
                        <p className="text-sm text-gray-500 mb-2">{query.message}</p>

                        <select
                            value={query.status}
                            onChange={(e) => handleStatusChange(query._id, e.target.value)}
                            disabled={updatingId === query._id}
                            className="border rounded px-2 py-1 text-sm w-full"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Process">In Process</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QueryTab;
