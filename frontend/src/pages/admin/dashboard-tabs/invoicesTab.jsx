import {
    Eye,
    Edit,
    Trash2,
    Plus,
} from "lucide-react"

import { useState } from "react"
import InvoiceForm from "../../../components/admin/invoice/invoice-form.jsx"
import InvoiceView from "../../../components/admin/invoice/invoice-view.jsx"

const InvoicesTab = ({ data }) => {

    const [showInvoiceForm, setShowInvoiceForm] = useState(false)
    const [showInvoiceView, setShowInvoiceView] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState(null)
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Invoice Management</h2>
                <button
                    onClick={() => setShowInvoiceForm(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Create Invoice
                </button>
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
                        {data.invoices.map((invoice) => (
                            <tr key={invoice._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{invoice.customer.fullName}</div>
                                    <div className="text-sm text-gray-500">{invoice.customer.phoneNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{invoice.total.toFixed(3)} KWD</td>
                                <td className="px-6 py-4 whitespace-nowrap">
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(invoice.dueDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                                            onClick={() => handleDeleteItem("invoices", invoice._id)}
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
                {data.invoices.map((invoice) => (
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
                        <p className="text-sm text-gray-900 font-medium">{invoice.customer.fullName}</p>
                        <p className="text-sm text-gray-500 mb-1">{invoice.customer.phoneNumber}</p>
                        <p className="text-sm text-gray-600 mb-1">Amount: {invoice.total.toFixed(3)} KWD</p>
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
                                onClick={() => handleDeleteItem("invoices", invoice._id)}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}

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

export default InvoicesTab;