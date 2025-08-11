import {
    Eye,
    Edit,
} from "lucide-react"
import { useState } from "react"
import OrderEdit from "../../../components/admin/order/orderEdit.jsx";
import OrderView from "../../../components/admin/order/orderView.jsx";

const OrdersTab = ({ data }) => {

    const [selectedItem, setSelectedItem] = useState(null)

    const [showOrderView, setShowOrderView] = useState(false)
    const [showOrderEdit, setShowOrderEdit] = useState(false)
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Orders Management</h2>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.total.toFixed(3)} KWD</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === "completed"
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
                                        <button
                                            className="text-blue-600 hover:text-blue-800"
                                            aria-label={`View order ${order.orderNumber}`}
                                            onClick={() => {
                                                setSelectedItem(order);
                                                setShowOrderView(true);
                                            }}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className="text-green-600 hover:text-green-800"
                                            aria-label={`Edit order ${order.orderNumber}`}
                                            onClick={() => {
                                                setSelectedItem(order);
                                                setShowOrderEdit(true);
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

            {/* Mobile Card/List View */}
            <div className="sm:hidden space-y-4">
                {data.orders.map((order) => (
                    <div key={order._id} className="bg-white shadow rounded p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                            <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">{order.customer.fullName}</p>
                        <p className="text-sm text-gray-500 mb-1">{order.customer.phoneNumber}</p>
                        <p className="text-sm text-gray-600 mb-1">Total: {order.total.toFixed(3)} KWD</p>
                        <p className="text-sm text-gray-600 mb-3">Date: {new Date(order.createdAt).toLocaleDateString()}</p>

                        <div className="flex gap-4">
                            <button
                                className="text-blue-600 hover:text-blue-800"
                                aria-label={`View order ${order.orderNumber}`}
                                onClick={() => {
                                    setSelectedItem(order);
                                    setShowOrderView(true);
                                }}
                            >
                                <Eye size={20} />
                            </button>
                            <button
                                className="text-green-600 hover:text-green-800"
                                aria-label={`Edit order ${order.orderNumber}`}
                                onClick={() => {
                                    setSelectedItem(order);
                                    setShowOrderEdit(true);
                                }}
                            >
                                <Edit size={20} />
                            </button>
                        </div>
                    </div>
                ))}
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
        </div>
    )
}

export default OrdersTab;