import { useState, useEffect, useCallback } from "react";
import { Eye } from "lucide-react";
import axiosInstance from "../../../api/axios-instance";
import QueryView from "../../../components/admin/queries/queryView";
import SearchBar from "../../../components/admin/searchBar.jsx";

const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in process": "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
};

// Helper to truncate long text with ellipsis after n chars
const truncate = (str, n = 60) =>
    str.length > n ? str.slice(0, n) + "..." : str;

const QueryTab = () => {
    const [queries, setQueries] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [selectedQuery, setSelectedQuery] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [updatingId, setUpdatingId] = useState(null);

    const fetchQueries = useCallback(async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const params = { page, limit: 20, search, status };
            const res = await axiosInstance.get("/api/queries/admin", { params });

            if (res.data.queries.length > 0) {
                setQueries((prev) => [...prev, ...res.data.queries]);
                setPage((p) => p + 1);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Error fetching queries:", err);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading, search, status]);

    // Reset pagination on filter change
    useEffect(() => {
        setQueries([]);
        setPage(1);
        setHasMore(true);
    }, [search, status]);

    useEffect(() => {
        fetchQueries();
    }, [fetchQueries]);

    // Infinite scroll
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target.scrollingElement;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            fetchQueries();
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchQueries]);

    const handleStatusChange = async (queryId, newStatus) => {
        try {
            setUpdatingId(queryId);
            const res = await axiosInstance.put(`/api/queries/${queryId}/status`, {
                status: newStatus,
            });

            if (!res.data.success) {
                alert(res.data.message || "Failed to update status");
            } else {
                // Refresh queries list by resetting pagination
                setQueries([]);
                setPage(1);
                setHasMore(true);
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
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold">Customer Queries</h2>
                <div className="flex flex-wrap gap-4 items-center">
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search queries..."
                    />
                    <select
                        className="border rounded px-3 py-2"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in process">In Process</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full table-fixed border-collapse border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">Full Name</th>
                            <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">Phone</th>
                            <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">Subject</th>
                            <th className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">Message</th>
                            <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">Status</th>
                            <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-200">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {queries.map((query) => (
                            <tr key={query.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-left">{query.fullName}</td>
                                <td className="px-4 py-3 text-left">{query.phoneNumber}</td>
                                <td className="px-4 py-3 text-left">{query.subject}</td>
                                <td className="px-4 py-3 text-left" title={query.message}>
                                    {truncate(query.message, 80)}
                                </td>
                                <td className="px-4 py-3 text-left">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[query.status] || ""
                                            }`}
                                    >
                                        {query.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-left">
                                    <button
                                        onClick={() => {
                                            setSelectedQuery(query);
                                            setModalOpen(true);
                                        }}
                                        aria-label={`View query from ${query.fullName}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4">
                {queries.map((query) => (
                    <div key={query.id} className="bg-white shadow rounded p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">{query.fullName}</h3>
                            <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[query.status] || ""
                                    }`}
                            >
                                {query.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">📞 {query.phoneNumber}</p>
                        <p className="text-sm text-gray-600 mb-1">📌 {query.subject}</p>
                        <p className="text-sm text-gray-500 mb-2" title={query.message}>
                            {truncate(query.message, 100)}
                        </p>

                        <button
                            className="text-blue-600 hover:text-blue-800 mb-2"
                            onClick={() => {
                                setSelectedQuery(query);
                                setModalOpen(true);
                            }}
                            aria-label={`View query from ${query.fullName}`}
                        >
                            <Eye size={20} />
                        </button>
                    </div>
                ))}
            </div>

            {loading && <p className="text-center py-4">Loading...</p>}
            {!hasMore && queries.length > 0 && (
                <p className="text-center py-4 text-gray-500">No more queries</p>
            )}
            {!loading && queries.length === 0 && (
                <p className="text-center py-4 text-gray-500">No queries found</p>
            )}

            {modalOpen && selectedQuery && (
                <QueryView
                    query={selectedQuery}
                    onClose={() => {
                        setModalOpen(false);
                        setSelectedQuery(null);
                    }}
                    onStatusChange={handleStatusChange}
                    updatingId={updatingId}
                />
            )}
        </div>
    );
};

export default QueryTab;
