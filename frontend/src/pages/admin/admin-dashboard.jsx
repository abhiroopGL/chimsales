// import AdminNavbar from "../../components/admin/admin-navbar.jsx";
//
// const AdminDashboard = () => {
//     return (
//         <>
//             <AdminNavbar />
//             <div className="min-h-screen bg-white text-black p-6">
//                 <h2 className="text-2xl font-bold mb-6">Welcome, Manager</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="bg-black text-white p-4 rounded-xl shadow hover:scale-105 transition-all">
//                         <h3 className="text-lg font-semibold">Manage Products</h3>
//                         <p className="text-sm">Add, edit or delete chimney products</p>
//                     </div>
//                     <div className="bg-black text-white p-4 rounded-xl shadow hover:scale-105 transition-all">
//                         <h3 className="text-lg font-semibold">User Management</h3>
//                         <p className="text-sm">See all registered users</p>
//                     </div>
//                     <div className="bg-black text-white p-4 rounded-xl shadow hover:scale-105 transition-all">
//                         <h3 className="text-lg font-semibold">Order Overview</h3>
//                         <p className="text-sm">Track current and past orders</p>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };
//
// export default AdminDashboard;

"use client"

import { useState, useEffect } from "react"
import {useDispatch, useSelector} from "react-redux"
import {
    Users,
    Package,
    FileText,
    MessageSquare,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Eye,
    Edit,
    Trash2,
    Plus,
} from "lucide-react"
// import { toast } from "react-hot-toast"
import {showNotification} from "../../redux/slices/notificationSlice.js";
import axios from "axios"
import axiosInstance from "../../api/axios-instance.js";
import OrderEdit from "../../components/admin/order/orderEdit.jsx";
import OrderView from "../../components/admin/order/orderView.jsx";
import InvoiceForm from "../../components/admin/invoice/invoice-form.jsx"
import InvoiceView from "../../components/admin/invoice/invoice-view.jsx"

const AdminDashboard = () => {
    const { token } = useSelector((state) => state.authorization.isAuthenticated)
    const [activeTab, setActiveTab] = useState("orders")
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [data, setData] = useState({
        stats: {
            totalUsers: 0,
            totalProducts: 0,
            totalOrders: 0,
            totalRevenue: 0,
        },
        users: [],
        products: [],
        orders: [],
        queries: [],
        invoices: [],
    })

    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState("")
    const [selectedItem, setSelectedItem] = useState(null)

    const [showOrderView, setShowOrderView] = useState(false)
    const [showOrderEdit, setShowOrderEdit] = useState(false)

    const [showInvoiceForm, setShowInvoiceForm] = useState(false)
    const [showInvoiceView, setShowInvoiceView] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            // const [statsRes, usersRes, productsRes, ordersRes, queriesRes, invoicesRes] = await Promise.all([
            //     axiosInstance.get("/api/admin/stats"),
            //     axiosInstance.get("/api/admin/users"),
            //     axiosInstance.get("/api/products"),
            //     axiosInstance.get("/api/admin/orders"),
            //     axiosInstance.get("/api/admin/queries"),
            //     axiosInstance.get("/api/invoices"),
            // ])

            const [usersRes, productsRes, ordersRes, invoicesRes] = await Promise.all([
                await axiosInstance.get("/api/admin/users"),
                await axiosInstance.get("/api/products/admin"),
                await axiosInstance.get("/api/orders/admin"),
                await axiosInstance.get("/api/invoice"),
            ])

            setData({
                // stats: statsRes.data.stats || {
                //     totalUsers: usersRes.data.users?.length || 0,
                //     totalProducts: productsRes.data.products?.length || 0,
                //     totalOrders: ordersRes.data.orders?.length || 0,
                //     totalRevenue: ordersRes.data.orders?.reduce((sum, order) => sum + order.total, 0) || 0,
                // },
                stats: {
                    totalUsers: 156,
                    totalProducts: 24,
                    totalOrders: 89,
                    totalRevenue: 12450.5,
                },
                users: usersRes.data || [],
                products: productsRes.data || [],
                orders: ordersRes.data.orders || [],
                queries: [],
                invoices: invoicesRes.data.invoices || [],
            })
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
            const [usersRes, productsRes] = await Promise.all([
                await axiosInstance.get("/api/admin/users"),
                await axiosInstance.get("/api/products/admin"),
            ])
            // Set mock data for demo including invoices
            setData({
                stats: {
                    totalUsers: 156,
                    totalProducts: 24,
                    totalOrders: 89,
                    totalRevenue: 12450.5,
                },
                users: usersRes.data || [],
                products: productsRes.data || [],
                orders: [
                    {
                        _id: "1",
                        orderNumber: "ORD-001",
                        customer: { fullName: "Ahmed Al-Rashid", phoneNumber: "+96550001234" },
                        total: 450,
                        status: "pending",
                        createdAt: "2024-01-25T09:00:00Z",
                    },
                ],
                queries: [
                    {
                        _id: "1",
                        fullName: "Mohammed Al-Qattan",
                        phoneNumber: "+96550009999",
                        subject: "Product Inquiry",
                        message: "I need information about chimney installation.",
                        status: "pending",
                        createdAt: "2024-01-26T11:00:00Z",
                    },
                ],
                invoices: [
                    {
                        _id: "1",
                        invoiceNumber: "INV-001",
                        customer: { fullName: "Ahmed Al-Rashid", phoneNumber: "+96550001234" },
                        total: 450,
                        status: "sent",
                        dueDate: "2024-02-25T00:00:00Z",
                        createdAt: "2024-01-25T09:00:00Z",
                    },
                    {
                        _id: "2",
                        invoiceNumber: "INV-002",
                        customer: { fullName: "Sarah Al-Sabah", phoneNumber: "+96550005678" },
                        total: 320,
                        status: "paid",
                        dueDate: "2024-02-20T00:00:00Z",
                        createdAt: "2024-01-20T14:30:00Z",
                    },
                ],
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteItem = async (type, id) => {
        if (!confirm("Are you sure you want to delete this item?")) return

        try {
            await axios.delete(`/api/admin/${type}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            dispatch(showNotification({
                message: "Item deleted successfully",
                type: "success"
            }))
            fetchDashboardData()
        } catch (error) {
            dispatch(showNotification({
                message: "Failed to delete item",
                type: "error"
            }))
            console.error("Error deleting item:", error)
        }
    }

    const StatCard = ({ title, value, icon: Icon, color, change }) => (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <p className={`text-sm ${change > 0 ? "text-green-600" : "text-red-600"}`}>
                            {change > 0 ? "+" : ""}
                            {change}% from last month
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>
        </div>
    )

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === id ? "bg-black text-white" : "text-gray-600 hover:text-black hover:bg-gray-100"
            }`}
        >
            <Icon size={18} />
            {label}
        </button>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage your e-commerce platform</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Users" value={data.stats.totalUsers} icon={Users} color="bg-blue-500" change={12} />
                    <StatCard
                        title="Total Products"
                        value={data.stats.totalProducts}
                        icon={Package}
                        color="bg-green-500"
                        change={8}
                    />
                    <StatCard
                        title="Total Orders"
                        value={data.stats.totalOrders}
                        icon={ShoppingCart}
                        color="bg-purple-500"
                        change={-3}
                    />
                    <StatCard
                        title="Revenue"
                        value={`${data.stats.totalRevenue.toFixed(3)} KWD`}
                        icon={DollarSign}
                        color="bg-yellow-500"
                        change={15}
                    />
                </div>

                {/* Sales Chart */}
                {/* {activeTab === "overview" && (
                    <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp size={20} />
                            Sales Overview
                        </h2>
                        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                                <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Sales chart visualization would go here</p>
                                <p className="text-sm text-gray-500">Integration with Chart.js or similar library</p>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {/* <TabButton id="overview" label="Overview" icon={TrendingUp} /> */}
                    <TabButton id="users" label="Users" icon={Users} />
                    <TabButton id="products" label="Products" icon={Package} />
                    <TabButton id="orders" label="Orders" icon={FileText} />
                    <TabButton id="queries" label="Queries" icon={MessageSquare} />
                    <TabButton id="invoices" label="Invoices" icon={FileText} />
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Users Tab */}
                    {activeTab === "users" && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Users Management</h2>
                                <button className="btn-primary flex items-center gap-2">
                                    <Plus size={18} />
                                    Add User
                                </button>
                            </div>
                            <div className="overflow-x-auto">
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
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
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
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="text-green-600 hover:text-green-800">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem("users", user._id)}
                                                        className="text-red-600 hover:text-red-800"
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
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === "products" && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Products Management</h2>
                                <button className="btn-primary flex items-center gap-2">
                                    <Plus size={18} />
                                    Add Product
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {data.products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                                {product.category}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {product.price.toFixed(3)} KWD
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.stock}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  product.status === "published"
                                      ? "bg-green-100 text-green-800"
                                      : product.status === "draft"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                              }`}
                          >
                            {product.status}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button className="text-blue-600 hover:text-blue-800">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="text-green-600 hover:text-green-800">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem("products", product._id)}
                                                        className="text-red-600 hover:text-red-800"
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
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === "orders" && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Orders Management</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {data.orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{order.orderNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.customer.fullName}</div>
                                                <div className="text-sm text-gray-500">{order.customer.phoneNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {order.total.toFixed(3)} KWD
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  order.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : order.status === "pending"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                              }`}
                          >
                            {order.status}
                          </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                    setSelectedItem(order)
                                                    setShowOrderView(true)
                                                    }}>
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="text-green-600 hover:text-green-800"
                                                    onClick={() => {
                                                        setSelectedItem(order)
                                                        setShowOrderEdit(true)
                                                    }}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Queries Tab */}
                    {activeTab === "queries" && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Customer Queries</h2>
                            </div>
                            <div className="space-y-4">
                                {data.queries.map((query) => (
                                    <div key={query._id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-semibold text-lg">{query.fullName}</h3>
                                                <p className="text-sm text-gray-600">{query.phoneNumber}</p>
                                            </div>
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    query.status === "resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                        {query.status}
                      </span>
                                        </div>
                                        <div className="mb-3">
                                            <p className="font-medium text-sm text-gray-700">Subject: {query.subject}</p>
                                            <p className="text-sm text-gray-600 mt-1">{query.message}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>{new Date(query.createdAt).toLocaleString()}</span>
                                            <div className="flex gap-2">
                                                <button className="text-blue-600 hover:text-blue-800">Reply</button>
                                                <button className="text-green-600 hover:text-green-800">Mark Resolved</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Invoices Tab */}
                    {activeTab === "invoices" && (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Invoice Management</h2>
                                <button onClick={() => setShowInvoiceForm(true)} className="btn-primary flex items-center gap-2">
                                    <Plus size={18} />
                                    Create Invoice
                                </button>
                            </div>
                            <div className="overflow-x-auto">
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
                                    {data.invoices.map((invoice) => (
                                        <tr key={invoice._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{invoice.customer.fullName}</div>
                                                <div className="text-sm text-gray-500">{invoice.customer.phoneNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {invoice.total.toFixed(3)} KWD
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  invoice.status === "paid"
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(invoice.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedInvoice(invoice)
                                                            setShowInvoiceView(true)
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedInvoice(invoice)
                                                            setShowInvoiceForm(true)
                                                        }}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem("invoices", invoice._id)}
                                                        className="text-red-600 hover:text-red-800"
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
                        </div>
                    )}
                </div>

                {showOrderView && selectedItem && (
                    <OrderView
                        orderId={selectedItem._id}
                        onClose={() => {
                        setShowOrderView(false)
                        setSelectedItem(null)
                        }}
                    />
                )}


                {showOrderEdit && selectedItem && (
                    <OrderEdit
                        orderId={selectedItem._id}
                        onClose={() => {
                        setShowOrderEdit(false)
                        setSelectedItem(null)
                        }}
                        onSuccess={() => {
                        fetchDashboardData()
                        setSelectedItem(null)
                        }}
                    />
                )}



                {/* Invoice Form Modal */}
                {showInvoiceForm && (
                    <InvoiceForm
                        invoice={selectedInvoice}
                        onClose={() => {
                            setShowInvoiceForm(false)
                            setSelectedInvoice(null)
                        }}
                        onSuccess={() => {
                            fetchDashboardData()
                            setSelectedInvoice(null)
                        }}
                    />
                )}

                {/*/!* Invoice View Modal *!/*/}
                {showInvoiceView && selectedInvoice && (
                    <InvoiceView
                        invoiceId={selectedInvoice._id}
                        onClose={() => {
                            setShowInvoiceView(false)
                            setSelectedInvoice(null)
                        }}
                        onEdit={(invoice) => {
                            setShowInvoiceView(false)
                            setSelectedInvoice(invoice)
                            setShowInvoiceForm(true)
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
