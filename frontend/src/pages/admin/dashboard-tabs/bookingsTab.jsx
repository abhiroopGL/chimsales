import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../api/axios-instance";
import SearchBar from "../../../components/admin/searchBar";

const BookingsTab = () => {
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Fetch bookings for current page & filters
    const fetchBookings = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const params = {
                page,
                limit: 20,
            };
            if (search) params.search = search;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await axiosInstance.get("/api/booking", { params });
            const fetched = res.data.bookings || [];

            if (page === 1) {
                setBookings(fetched);
            } else {
                setBookings((prev) => [...prev, ...fetched]);
            }

            setHasMore(fetched.length === 20);
            setError(null);
            setPage((p) => p + 1);
        } catch (err) {
            setError("Failed to load bookings.");
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading, search, startDate, endDate]);

    // Reset on filters change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setBookings([]);
    }, [search, startDate, endDate]);

    // Fetch bookings when page or filters change
    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Infinite scroll handler
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target.scrollingElement;
        if (scrollHeight - scrollTop <= clientHeight + 100 && !loading && hasMore) {
            fetchBookings();
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchBookings, loading, hasMore]);

    const clearFilters = () => {
        setSearch("");
        setStartDate("");
        setEndDate("");
    };

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold">Bookings Management</h2>
                <div className="flex flex-wrap gap-2">
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full sm:w-64"
                    />

                    <input
                        type="date"
                        className="border rounded px-3 py-2"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="Start date"
                    />
                    <input
                        type="date"
                        className="border rounded px-3 py-2"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="End date"
                    />
                    <button
                        onClick={clearFilters}
                        className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {error && <p className="text-center text-red-600 mb-4">{error}</p>}

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[700px] border border-gray-300 rounded-md">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left border-b border-gray-200">Booking #</th>
                            <th className="px-6 py-3 text-left border-b border-gray-200">Customer</th>
                            <th className="px-6 py-3 text-left border-b border-gray-200">Phone</th>
                            <th className="px-6 py-3 text-left border-b border-gray-200">Email</th>
                            <th className="px-6 py-3 text-left border-b border-gray-200">Total</th>
                            <th className="px-6 py-3 text-left border-b border-gray-200">Status</th>
                            <th className="px-6 py-3 text-left border-b border-gray-200">Created At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {bookings.map((b) => (
                            <tr key={b._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{b.bookingNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{b.customerInfo.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{b.customerInfo.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{b.customerInfo.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{b.total.toFixed(3)} KWD</td>
                                <td className="px-6 py-4 whitespace-nowrap capitalize">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${b.status === "confirmed"
                                            ? "bg-green-100 text-green-800"
                                            : b.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {b.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(b.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card/List View */}
            <div className="sm:hidden space-y-4">
                {bookings.map((b) => (
                    <div
                        key={b._id}
                        className="bg-white shadow rounded p-4 border border-gray-200"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-semibold text-lg">{b.bookingNumber}</div>
                            <span
                                className={`px-2 py-1 text-xs rounded-full ${b.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : b.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {b.status}
                            </span>
                        </div>
                        <div className="mb-1">
                            <div className="font-medium">{b.customerInfo.fullName}</div>
                            <div className="text-sm text-gray-500">{b.customerInfo.phone}</div>
                            <div className="text-sm text-gray-500">{b.customerInfo.email}</div>
                        </div>
                        <div className="mb-1 text-sm text-gray-600 font-medium">
                            Total: {b.total.toFixed(3)} KWD
                        </div>
                        <div className="mb-3 text-sm text-gray-600">
                            Date: {new Date(b.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {loading && <p className="text-center py-4">Loading...</p>}
            {!hasMore && bookings.length > 0 && (
                <p className="text-center py-4 text-gray-500">No more bookings</p>
            )}
            {!loading && bookings.length === 0 && (
                <p className="text-center py-4 text-gray-500">No bookings found</p>
            )}
        </div>
    );
};

export default BookingsTab;
