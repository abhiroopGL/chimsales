import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../api/axios-instance";
import {
    Eye,
    Edit,
    Trash2,
    Plus,
} from "lucide-react";

import InvoiceForm from "../../../components/admin/invoice/invoice-form.jsx";
import InvoiceView from "../../../components/admin/invoice/invoice-view.jsx";
import SearchBar from "../../../components/admin/searchBar.jsx";

const InvoicesTab = () => {
    const [invoices, setInvoices] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [showInvoiceView, setShowInvoiceView] = useState(false);

    // Fetch invoices with pagination, search, and status filters
    const fetchInvoices = useCallback(async () => {
        if (!hasMore || loading) return;
        setLoading(true);
        try {
            const params = { page, limit: 20 };
            if (search.trim() !== "") params.search = search.trim();
            if (status !== "") params.status = status;

            const res = await axiosInstance.get("/api/invoice", { params });

            if (res.data.invoices.length > 0) {
                setInvoices((prev) => [...prev, ...res.data.invoices]);
                setPage((p) => p + 1);
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Error fetching invoices:", err);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading, search, status]);

    // Reset invoices when filters/search change
    useEffect(() => {
        setInvoices([]);
        setPage(1);
        setHasMore(true);
    }, [search, status]);

    // Fetch invoices on load and when fetchInvoices changes
    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    // Infinite scroll handler
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target.scrollingElement;
        if (scrollHeight - scrollTop <= clientHeight + 100) {
            fetchInvoices();
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchInvoices]);

    // Dummy delete handler — implement as needed
    const handleDeleteItem = async (id) => {
        if (!confirm("Are you sure you want to delete this invoice?")) return;
        try {
            await axiosInstance.delete(`/api/invoice/${id}`);
            alert("Invoice deleted successfully");
            // Reset to reload invoices
            setInvoices([]);
            setPage(1);
            setHasMore(true);
        } catch (err) {
            alert("Failed to delete invoice");
            console.error(err);
        }
    };

    // Add this helper function inside your component or import it
    const truncate = (text, maxLength = 30) => {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Invoice Management</h2>
                <button
                    onClick={() => setShowInvoiceForm(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Create Invoice
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <SearchBar
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search invoice #..."
                />
                <select
                    className="border rounded px-3 py-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="sent">Sent</option>
                    <option value="overdue">Overdue</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>


                    <tbody className="divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                            <tr key={invoice._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-left font-medium text-gray-900">
                                    {truncate(invoice.invoiceNumber, 50)}
                                </td>
                                <td className="px-6 py-4 text-left">
                                    <div className="text-sm text-gray-900">
                                        {truncate(invoice.customer?.fullName || invoice.createdBy?.fullName || "N/A", 25)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {truncate(invoice.customer?.phoneNumber || "-", 20)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-left text-sm text-gray-600 whitespace-nowrap">
                                    {invoice.total?.toFixed(3)} KWD
                                </td>
                                <td className="px-6 py-4 text-left">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${invoice.status === "paid"
                                            ? "bg-green-100 text-green-800"
                                            : invoice.status === "sent"
                                                ? "bg-blue-100 text-blue-800"
                                                : invoice.status === "overdue"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                    >
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-left text-sm text-gray-600 whitespace-nowrap">
                                    {new Date(invoice.dueDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-left text-sm font-medium">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedInvoice(invoice);
                                                setShowInvoiceView(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800"
                                            aria-label={`View invoice ${invoice.invoiceNumber}`}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedInvoice(invoice);
                                                setShowInvoiceForm(true);
                                            }}
                                            className="text-green-600 hover:text-green-800"
                                            aria-label={`Edit invoice ${invoice.invoiceNumber}`}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(invoice._id)}
                                            className="text-red-600 hover:text-red-800"
                                            aria-label={`Delete invoice ${invoice.invoiceNumber}`}
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
                {invoices.map((invoice) => (
                    <div key={invoice._id} className="bg-white shadow rounded p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg">Invoice #{invoice.invoiceNumber}</h3>
                            <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${invoice.status === "paid"
                                    ? "bg-green-100 text-green-800"
                                    : invoice.status === "sent"
                                        ? "bg-blue-100 text-blue-800"
                                        : invoice.status === "overdue"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                            >
                                {invoice.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">{invoice.customer?.fullName || invoice.createdBy?.fullName || "N/A"}</p>
                        <p className="text-sm text-gray-500 mb-1">{invoice.customer?.phoneNumber || "-"}</p>
                        <p className="text-sm text-gray-600 mb-1">Amount: {invoice.total?.toFixed(3)} KWD</p>
                        <p className="text-sm text-gray-600 mb-3">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>

                        <div className="flex gap-4">
                            <button
                                className="text-blue-600 hover:text-blue-800"
                                aria-label={`View invoice ${invoice.invoiceNumber}`}
                                onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowInvoiceView(true);
                                }}
                            >
                                <Eye size={20} />
                            </button>
                            <button
                                className="text-green-600 hover:text-green-800"
                                aria-label={`Edit invoice ${invoice.invoiceNumber}`}
                                onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setShowInvoiceForm(true);
                                }}
                            >
                                <Edit size={20} />
                            </button>
                            <button
                                className="text-red-600 hover:text-red-800"
                                aria-label={`Delete invoice ${invoice.invoiceNumber}`}
                                onClick={() => handleDeleteItem(invoice._id)}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Invoice Form Modal */}
            {showInvoiceForm && (
                <InvoiceForm
                    invoice={selectedInvoice}
                    onClose={() => {
                        setShowInvoiceForm(false);
                        setSelectedInvoice(null);
                    }}
                    onSuccess={() => {
                        setInvoices([]);
                        setPage(1);
                        setHasMore(true);
                    }}
                />
            )}

            {/* Invoice View Modal */}
            {showInvoiceView && selectedInvoice && (
                <InvoiceView
                    invoiceId={selectedInvoice._id}
                    onClose={() => {
                        setShowInvoiceView(false);
                        setSelectedInvoice(null);
                    }}
                    onEdit={(invoice) => {
                        setShowInvoiceView(false);
                        setSelectedInvoice(invoice);
                        setShowInvoiceForm(true);
                    }}
                />
            )}

            {loading && <p className="text-center py-4">Loading...</p>}
            {!hasMore && !loading && <p className="text-center py-4 text-gray-500">No more invoices</p>}
        </div>
    );
};

export default InvoicesTab;
