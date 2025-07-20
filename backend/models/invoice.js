const mongoose = require('mongoose');
const generateInvoiceNumber = require('../utils/generate_invoice_number');

const invoiceItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
})

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      default: () => generateInvoiceNumber(),
    },
    customer: {
      fullName: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      address: {
        street: String,
        area: String,
        governorate: String,
        block: String,
        building: String,
        floor: String,
        apartment: String,
      },
    },
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidDate: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
    terms: {
      type: String,
      default: "Payment is due within 30 days of invoice date.",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  },
)

// Auto-generate invoice number if not provided
invoiceSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = generateInvoiceNumber();
  }
  next()
})

// Update status based on due date
invoiceSchema.methods.updateStatus = function () {
  if (this.status === "sent" && new Date() > this.dueDate) {
    this.status = "overdue"
  }
}

// Index for efficient queries
invoiceSchema.index({ invoiceNumber: 1 })
invoiceSchema.index({ "customer.phoneNumber": 1 })
invoiceSchema.index({ status: 1, dueDate: 1 })
invoiceSchema.index({ createdAt: -1 })

module.exports = mongoose.model("Invoice", invoiceSchema)
