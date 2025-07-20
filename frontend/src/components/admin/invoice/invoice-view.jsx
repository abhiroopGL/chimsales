"use client"

import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { X, Download, Send, Edit, Printer } from "lucide-react"
import { fetchInvoiceById, sendInvoice } from "../../../redux/slices/invoiceSlice.jsx"
import { showNotification } from "../../../redux/slices/notificationSlice"

const InvoiceView = ({ invoiceId, onClose, onEdit }) => {
    debugger
  const dispatch = useDispatch()
  const { currentInvoice, isLoading } = useSelector((state) => state.invoices)
  const printRef = useRef()

  useEffect(() => {
    if (invoiceId) {
      dispatch(fetchInvoiceById(invoiceId))
    }
  }, [dispatch, invoiceId])

  const handleSendInvoice = async () => {
    try {
      await dispatch(sendInvoice(invoiceId)).unwrap()
        dispatch(showNotification({
            type: "success",
            message: "Invoice sent successfully!"
        }))
    } catch (error) {
      dispatch(showNotification({
        type: "error",
        message: "Failed to send invoice"
      }))
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${currentInvoice?.invoiceNumber}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      dispatch(showNotification({
        type: "error",
        message: "Failed to download invoice"
      }))
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!currentInvoice) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center print:hidden">
          <h2 className="text-2xl font-bold">Invoice {currentInvoice.invoiceNumber}</h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
              <Printer size={16} />
              Print
            </button>
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2">
              <Download size={16} />
              Download
            </button>
            <button onClick={handleSendInvoice} className="btn-primary flex items-center gap-2">
              <Send size={16} />
              Send
            </button>
            <button onClick={() => onEdit(currentInvoice)} className="btn-secondary flex items-center gap-2">
              <Edit size={16} />
              Edit
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} className="p-8 print:p-0">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black">MetalcoSteel</h1>
              <p className="text-gray-600 mt-2">Kuwait's Premier Chimney Store</p>
              <p className="text-sm text-gray-500">Kuwait City, Kuwait</p>
              <p className="text-sm text-gray-500">+965 2222 3333</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
              <p className="text-lg font-semibold">{currentInvoice.invoiceNumber}</p>
              <p className="text-sm text-gray-600">Date: {new Date(currentInvoice.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Due: {new Date(currentInvoice.dueDate).toLocaleDateString()}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  currentInvoice.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : currentInvoice.status === "sent"
                      ? "bg-blue-100 text-blue-800"
                      : currentInvoice.status === "overdue"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {currentInvoice.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Bill To:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold">{currentInvoice.customer.fullName}</p>
              <p className="text-gray-600">{currentInvoice.customer.phoneNumber}</p>
              {currentInvoice.customer.email && <p className="text-gray-600">{currentInvoice.customer.email}</p>}
              {currentInvoice.customer.address && (
                <div className="text-gray-600 text-sm mt-2">
                  {[
                    currentInvoice.customer.address.street,
                    currentInvoice.customer.address.area,
                    currentInvoice.customer.address.governorate,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Qty</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="font-medium">{item.productName}</div>
                      {item.description && <div className="text-sm text-gray-600">{item.description}</div>}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{item.unitPrice.toFixed(3)} KWD</td>
                    <td className="border border-gray-300 px-4 py-3 text-right">{item.total.toFixed(3)} KWD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{currentInvoice.subtotal.toFixed(3)} KWD</span>
                </div>
                {currentInvoice.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({currentInvoice.discountRate}%):</span>
                    <span>-{currentInvoice.discountAmount.toFixed(3)} KWD</span>
                  </div>
                )}
                {currentInvoice.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax ({currentInvoice.taxRate}%):</span>
                    <span>{currentInvoice.taxAmount.toFixed(3)} KWD</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{currentInvoice.total.toFixed(3)} KWD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {(currentInvoice.notes || currentInvoice.terms) && (
            <div className="space-y-4">
              {currentInvoice.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notes:</h4>
                  <p className="text-gray-600 text-sm">{currentInvoice.notes}</p>
                </div>
              )}
              {currentInvoice.terms && (
                <div>
                  <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
                  <p className="text-gray-600 text-sm">{currentInvoice.terms}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-8 border-t text-center text-gray-500 text-sm">
            <p>Thank you for your business!</p>
            <p>MetalcoSteel - Kuwait's Premier Chimney Store</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceView
