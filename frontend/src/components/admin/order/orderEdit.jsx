"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import axios from "axios"
import { showNotification } from "../../../redux/slices/notificationSlice"
import { useDispatch, useSelector } from "react-redux"
import { fetchOrderById, updateOrder } from "../../../redux/slices/orderSlice"

const OrderEdit = ({ orderId, onClose, onSuccess }) => {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const dispatch = useDispatch()
  const { isSaving } = useSelector((state) => state.orders)
  const [formData, setFormData] = useState({
    status: "",
    paymentStatus: "",
    notes: "",
  })

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      dispatch(fetchOrderById(orderId)).then((res) => {
        if (!res.error) {
          const orderData = res.payload
          setOrder(orderData)
          setFormData({
            status: orderData.status || "",
            paymentStatus: orderData.paymentStatus || "",
            notes: orderData.notes || "",
          })
        }
      })
      
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

      dispatch(updateOrder({ orderId, formData })).then((res) => {
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
        }
      })
      onClose()
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
        <div className="bg-white rounded-lg p-8">
          <p>Order not found</p>
          <button onClick={onClose} className="btn-primary mt-4">
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Order - {order.orderNumber}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
            <select
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about this order..."
            />
          </div>

          {/* Order Details (Read-only) */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
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
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrderEdit
