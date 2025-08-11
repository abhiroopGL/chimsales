"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { showNotification } from "../../../redux/slices/notificationSlice"
import { useDispatch, useSelector } from "react-redux"
import { fetchOrderById, updateOrder } from "../../../redux/slices/orderSlice"

const OrderEdit = ({ orderId, onClose, onSuccess }) => {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
    notes: "",
  })

  useEffect(() => {
    fetchOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const res = await dispatch(fetchOrderById(orderId))
      if (!res.error) {
        const orderData = res.payload
        setOrder(orderData)
        setFormData({
          status: orderData.status || "",
          paymentStatus: orderData.paymentStatus || "",
          notes: orderData.notes || "",
        })
      }
    } catch (error) {
      dispatch(showNotification({
        type: "error",
        message: "Failed to fetch order details",
      }))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await dispatch(updateOrder({ orderId, formData }))
      if (res.error) {
        dispatch(showNotification({
          type: "error",
          message: "Failed to update order",
        }))
      } else {
        dispatch(showNotification({
          type: "success",
          message: "Order updated successfully",
        }))
        onSuccess?.()
        onClose()
      }
    } catch (error) {
      dispatch(showNotification({
        type: "error",
        message: "Failed to update order",
      }))
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-sm w-full text-center">
          <p className="text-gray-700 text-lg mb-4">Order not found</p>
          <button
            onClick={onClose}
            className="btn-primary px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-edit-title"
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-300
                  sm:max-w-xl sm:p-6
                  xs:max-w-full xs:mx-2 xs:p-4"
      >
        <header
          className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center
                     sm:px-4 sm:py-3 xs:px-3 xs:py-2"
        >
          <h2
            id="order-edit-title"
            className="text-2xl font-bold sm:text-xl xs:text-lg truncate"
          >
            Edit Order - {order.orderNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 sm:p-4 sm:space-y-5 xs:p-3 xs:space-y-4"
        >
          {/* Order Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Order Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label
              htmlFor="paymentStatus"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Payment Status
            </label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              placeholder="Add any notes about this order..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {/* Order Details (Read-only) */}
          <section
            aria-label="Order Details"
            className="bg-gray-50 rounded-lg p-4"
          >
            <h3 className="font-semibold mb-3 text-gray-800">Order Details</h3>
            <div
              className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-1 sm:gap-2"
            >
              <div>
                <span className="text-gray-600">Customer:</span>
                <span className="ml-2 font-medium">{order.customer?.fullName}</span>
              </div>
              <div>
                <span className="text-gray-600">Total:</span>
                <span className="ml-2 font-medium">{order.total?.toFixed(3)} KWD</span>
              </div>
              <div>
                <span className="text-gray-600">Payment Method:</span>
                <span className="ml-2 font-medium capitalize">{order.paymentMethod}</span>
              </div>
              <div>
                <span className="text-gray-600">Order Date:</span>
                <span className="ml-2 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <footer
            className="flex justify-end gap-4 pt-6 border-t
                       sm:flex-col sm:gap-3 sm:pt-4 xs:gap-2 xs:pt-3"
          >
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50
                         focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50
                         focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-full"
            >
              {saving ? "Saving..." : "Update Order"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default OrderEdit
