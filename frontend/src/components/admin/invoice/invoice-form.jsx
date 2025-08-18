"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { showNotification } from "../../../redux/slices/notificationSlice"
import { X, Plus, Trash2, Calculator } from "lucide-react"
import { createInvoice, updateInvoice, fetchInvoiceById } from "../../../redux/slices/invoiceSlice"
import { fetchPublicProducts } from "../../../redux/slices/productSlice"

const InvoiceForm = ({ invoiceId, onClose, onSuccess }) => {
  const dispatch = useDispatch()
  const { publicProducts: products } = useSelector((state) => state.products)
  const { currentInvoice, isLoading } = useSelector((state) => state.invoices)

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerStreet: "",
    customerArea: "",
    customerGovernorate: "",
    items: [
      {
        productId: "",
        productName: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discountRate: 0,
    discountAmount: 0,
    total: 0,
    dueDate: "",
    notes: "",
    terms: "Payment is due within 30 days of invoice date.",
  })

  // Fetch products and invoice details
  useEffect(() => {
    dispatch(fetchPublicProducts())
  }, [dispatch])

  useEffect(() => {
    if (invoiceId) dispatch(fetchInvoiceById(invoiceId))
  }, [dispatch, invoiceId])

  // Populate form once invoice is fetched
  useEffect(() => {
    if (currentInvoice) {
      setFormData({
        invoiceNumber: currentInvoice.invoiceNumber,
        customerName: currentInvoice.customerName || "",
        customerPhone: currentInvoice.customerPhone || "",
        customerEmail: currentInvoice.customerEmail || "",
        customerStreet: currentInvoice.customerStreet || formData.customerStreet,
        customerArea: currentInvoice.customerArea || formData.customerArea,
        customerGovernorate: currentInvoice.customerGovernorate || formData.customerGovernorate,
        subtotal: currentInvoice.subtotal || 0,
        taxRate: currentInvoice.taxRate || 0,
        taxAmount: currentInvoice.taxAmount || 0,
        discountRate: currentInvoice.discountRate || 0,
        discountAmount: currentInvoice.discountAmount || 0,
        total: currentInvoice.total || 0,
        dueDate: currentInvoice.dueDate ? currentInvoice.dueDate.split("T")[0] : "",
        notes: currentInvoice.notes || "",
        terms: currentInvoice.terms || formData.terms,
        items:
          currentInvoice.items?.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })) || formData.items,
      })
    }
  }, [currentInvoice])

  // Recalculate totals when items/tax/discount change
  useEffect(() => {
    calculateTotals()
  }, [formData.items, formData.taxRate, formData.discountRate])

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0)
    const discountAmount = (subtotal * formData.discountRate) / 100
    const taxableAmount = subtotal - discountAmount
    const taxAmount = (taxableAmount * formData.taxRate) / 100
    const total = taxableAmount + taxAmount

    setFormData((prev) => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      total,
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Directly update the field in formData
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Replacing handleItemChange
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]

    if (field === "product") {
      const selectedProduct = products.find((p) => p.id == value || p._id == value)
      if (selectedProduct) {
        newItems[index] = {
          ...newItems[index],
          productId: selectedProduct.id || selectedProduct._id,
          productName: selectedProduct.name,
          description: selectedProduct.description,
          unitPrice: selectedProduct.price,
          total: selectedProduct.price * newItems[index].quantity,
        }
      } else {
        // Reset if no product selected
        newItems[index] = {
          ...newItems[index],
          productId: "",
          productName: "",
          description: "",
          unitPrice: 0,
          total: 0,
        }
      }
    } else if (field === "quantity" || field === "unitPrice") {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        total: field === "quantity" ? value * newItems[index].unitPrice : newItems[index].quantity * value,
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value }
    }

    setFormData((prev) => ({ ...prev, items: newItems }))
  }


  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }))
    }
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: "", productName: "", description: "", quantity: 1, unitPrice: 0, total: 0 },
      ],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanedData = {
      invoiceNumber: formData.invoiceNumber,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      customerStreet: formData.customerStreet,
      customerArea: formData.customerArea,
      customerGovernorate: formData.customerGovernorate,
      items: formData.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      subtotal: formData.subtotal,
      taxRate: formData.taxRate,
      taxAmount: formData.taxAmount,
      discountRate: formData.discountRate,
      discountAmount: formData.discountAmount,
      total: formData.total,
      dueDate: formData.dueDate,
      notes: formData.notes,
      terms: formData.terms,
    }

    try {
      if (currentInvoice) {
        await dispatch(updateInvoice({ id: invoiceId, data: cleanedData })).unwrap()
        dispatch(showNotification({ type: "success", message: "Invoice updated successfully!" }))
      } else {
        await dispatch(createInvoice(cleanedData)).unwrap()
        dispatch(showNotification({ type: "success", message: "Invoice created successfully!" }))
      }
      onSuccess?.()
      onClose()
    } catch (error) {
      dispatch(showNotification({ type: "error", message: error || "Failed to save invoice" }))
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

  return (
    <div className="invoice-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{currentInvoice ? "Edit Invoice" : "Create New Invoice"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Invoice Header */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Invoice Number *</label>
              <div className="input-field bg-gray-100 text-base font-mono break-all">
                {formData.invoiceNumber || <span className="text-gray-400">Not assigned</span>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Due Date *</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Governorate</label>
                <select
                  name="customerGovernorate"
                  value={formData.customerGovernorate}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Select Governorate</option>
                  <option value="Kuwait City">Kuwait City</option>
                  <option value="Hawalli">Hawalli</option>
                  <option value="Ahmadi">Ahmadi</option>
                  <option value="Jahra">Jahra</option>
                  <option value="Mubarak Al-Kabeer">Mubarak Al-Kabeer</option>
                  <option value="Farwaniya">Farwaniya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Area</label>
                <input
                  type="text"
                  name="customerArea"
                  value={formData.customerArea}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Street</label>
                <input
                  type="text"
                  name="customerStreet"
                  value={formData.customerStreet}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Invoice Items</h3>
              <button type="button" onClick={addItem} className="btn-primary flex items-center gap-2">
                <Plus size={16} />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-6 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Product</label>
                      <select
                        value={item.productId || ''}
                        onChange={(e) => handleItemChange(index, "product", e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 1)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Unit Price (KWD)</label>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Total (KWD)</label>
                      <input type="text" value={item.total.toFixed(3)} className="input-field bg-gray-100" readOnly />
                    </div>
                    <div>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="w-full btn-secondary text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  {item.productName && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        className="input-field resize-none"
                        rows={2}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Calculations */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Additional notes for the customer..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Terms & Conditions</label>
                  <textarea
                    name="terms"
                    value={formData.terms}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calculator size={20} />
                Invoice Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formData.subtotal.toFixed(3)} KWD</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Discount %</label>
                    <input
                      type="number"
                      name="discountRate"
                      value={formData.discountRate}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Tax %</label>
                    <input
                      type="number"
                      name="taxRate"
                      value={formData.taxRate}
                      onChange={handleInputChange}
                      className="input-field text-sm"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>

                {formData.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formData.discountAmount.toFixed(3)} KWD</span>
                  </div>
                )}

                {formData.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formData.taxAmount.toFixed(3)} KWD</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formData.total.toFixed(3)} KWD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Saving..." : currentInvoice ? "Update Invoice" : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InvoiceForm
