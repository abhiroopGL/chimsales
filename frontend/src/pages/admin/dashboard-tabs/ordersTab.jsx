import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../api/axios-instance";
import { Eye, Edit } from "lucide-react";
import OrderEdit from "../../../components/admin/order/orderEdit.jsx";
import OrderView from "../../../components/admin/order/orderView.jsx";
import SearchBar from "../../../components/admin/searchBar.jsx";

const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");

    const [selectedItem, setSelectedItem] = useState(null);
    const [showOrderView, setShowOrderView] = useState(false);
    const [showOrderEdit, setShowOrderEdit] = useState(false);

    // Fetch orders for the current page and filters
    const fetchOrders = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const params = { page, limit: 20, search, status, date };
            const res = await axiosInstance.get("/api/orders/admin", { params });
            const fetchedOrders = res.data.orders || [];

            if (page === 1) {
                setOrders(fetchedOrders);
            } else {
                setOrders((prev) => [...prev, ...fetchedOrders]);
            }

            if (fetchedOrders.length < 20) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            setPage((p) => p + 1);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading, search, status, date]);

    // Reset page and orders when filters change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setOrders([]);
    }, [search, status, date]);

    // Fetch orders when page or filters change
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Infinite scroll handler
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target.scrollingElement;
        if (scrollHeight - scrollTop <= clientHeight + 100 && !loading && hasMore) {
            fetchOrders();
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchOrders, loading, hasMore]);

    const showLoadingIndicator = loading && (orders.length === 0 || hasMore);

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <h2 className="text-xl font-semibold">Orders Management</h2>
                <div className="flex flex-wrap gap-2">
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search orders..."
                    />
                    <select
                        className="border rounded px-3 py-2 appearance-none"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <input
                        type="date"
                        className="border rounded px-3 py-2"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[700px]">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Order #</th>
                            <th className="px-6 py-3 text-left">Customer</th>
                            <th className="px-6 py-3 text-left">Total</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">Date</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-left">{order.orderNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-left">
                                    <div>{order.customer?.fullName}</div>
                                    <div className="text-sm text-gray-500">{order.customer?.phoneNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-left">{order.total.toFixed(3)} KWD</td>
                                <td className="px-6 py-4 whitespace-nowrap text-left">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${order.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : order.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-left">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-left text-gray-700 flex gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedItem(order);
                                            setShowOrderView(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                        aria-label={`View order ${order.orderNumber}`}
                                    >
                                        <Eye size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedItem(order);
                                            setShowOrderEdit(true);
                                        }}
                                        className="text-green-600 hover:text-green-800"
                                        aria-label={`Edit order ${order.orderNumber}`}
                                    >
                                        <Edit size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card/List View */}
            <div className="sm:hidden space-y-4">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white shadow rounded p-4 border border-gray-200"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-semibold text-lg">{order.orderNumber}</div>
                            <span
                                className={`px-2 py-1 text-xs rounded-full ${order.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : order.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>
                        <div className="mb-1">
                            <div className="font-medium">{order.customer?.fullName}</div>
                            <div className="text-sm text-gray-500">{order.customer?.phoneNumber}</div>
                        </div>
                        <div className="mb-1 text-sm text-gray-600 font-medium">
                            Total: {order.total.toFixed(3)} KWD
                        </div>
                        <div className="mb-3 text-sm text-gray-600">
                            Date: {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setSelectedItem(order);
                                    setShowOrderView(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                                aria-label={`View order ${order.orderNumber}`}
                            >
                                <Eye size={24} />
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedItem(order);
                                    setShowOrderEdit(true);
                                }}
                                className="text-green-600 hover:text-green-800"
                                aria-label={`Edit order ${order.orderNumber}`}
                            >
                                <Edit size={24} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showLoadingIndicator && <p className="text-center py-4">Loading...</p>}
            {!hasMore && orders.length > 0 && (
                <p className="text-center py-4 text-gray-500">No more orders</p>
            )}
            {!loading && orders.length === 0 && (
                <p className="text-center py-4 text-gray-500">No orders found</p>
            )}

            {/* Modals */}
            {showOrderView && selectedItem && (
                <OrderView orderId={selectedItem._id} onClose={() => setShowOrderView(false)} />
            )}
            {showOrderEdit && selectedItem && (
                <OrderEdit
                    orderId={selectedItem._id}
                    onClose={() => setShowOrderEdit(false)}
                    onSuccess={() => {
                        setPage(1);
                        setOrders([]);
                        setHasMore(true);
                    }}
                />
            )}
        </div>
    );
};

export default OrdersTab;
