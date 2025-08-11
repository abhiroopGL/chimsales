"use client"

import { useState, useEffect } from "react"
import { X, Package, User, MapPin, DollarSign } from "lucide-react"
import { useDispatch } from "react-redux"
import { showNotification } from "../../../redux/slices/notificationSlice"
import { fetchOrderById } from "../../../redux/slices/orderSlice"

const OrderView = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await dispatch(fetchOrderById(orderId))
        if (!res.error) {
          setOrder(res.payload)
        } else {
          dispatch(showNotification({
            type: "error",
            message: "Failed to fetch order details",
          }))
        }
      } catch (error) {
        console.error(error)
        dispatch(showNotification({
          type: "error",
          message: "Server error while fetching order",
        }))
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, dispatch])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
          <p>Order not found</p>
          <button onClick={onClose} className="btn-primary mt-4 w-full">
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-bold">
            Order Details - {order.orderNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 sm:p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6 text-sm sm:text-base">
          {/* Order Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-semibold">Order Status</h3>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Order Date</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <User size={20} className="mr-2" /> Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField label="Name" value={order.customer?.fullName} />
              <InfoField label="Phone" value={order.customer?.phone} />
              <InfoField label="Email" value={order.customer?.email} />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <MapPin size={20} className="mr-2" /> Delivery Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField label="Governorate" value={order.deliveryAddress?.governorate} />
              <InfoField label="Area" value={order.deliveryAddress?.area} />
              <InfoField label="Street" value={order.deliveryAddress?.street} />
              <InfoField label="Block" value={order.deliveryAddress?.block} />
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Package size={20} className="mr-2" /> Order Items
            </h3>
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Product</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Price</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">{item.name || item.product?.name || "Product"}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">{item.price?.toFixed(3)} KWD</td>
                      <td className="px-4 py-3">{(item.quantity * item.price)?.toFixed(3)} KWD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <DollarSign size={20} className="mr-2" /> Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-medium capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total Amount:</span>
                <span>{order.total?.toFixed(3)} KWD</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-gray-600">{label}</p>
    <p className="font-medium">{value || "N/A"}</p>
  </div>
)

export default OrderView
