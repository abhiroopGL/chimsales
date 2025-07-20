const express = require('express');
const Invoice = require("../models/invoice.js")
const Order = require("../models/order.js")
const { admin } = require('../middleware/checkAdmin.js');
const { getAllInvoices, getSingleInvoice, updateInvoice, createNewInvoice } = require("../controllers/invoice_controller.js")

const router = express.Router()

// Get all invoices
router.get("/", admin, getAllInvoices)

// Get single invoice
router.get("/:id", getSingleInvoice)

// Create invoice (admin only)
router.post("/", createNewInvoice)

// Update invoice (admin only)
router.put("/:id", updateInvoice)

// Delete invoice (admin only)
router.delete("/:id", admin, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id)

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      })
    }

    res.json({
      success: true,
      message: "Invoice deleted successfully",
    })
  } catch (error) {
    console.error("Delete invoice error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to delete invoice",
    })
  }
})

// Send invoice
router.post("/:id/send", admin, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      })
    }

    invoice.status = "sent"
    invoice.sentAt = new Date()
    await invoice.save()

    // Here you would integrate with email/SMS service to send the invoice
    console.log(`Invoice ${invoice.invoiceNumber} sent to ${invoice.customer.phoneNumber}`)

    res.json({
      success: true,
      message: "Invoice sent successfully",
      invoice,
    })
  } catch (error) {
    console.error("Send invoice error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send invoice",
    })
  }
})

// Download invoice as PDF
router.get("/:id/download", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      })
    }

    // Check permissions
    if (req.user.role !== "admin" && invoice.customer.phoneNumber !== req.userDoc.phoneNumber) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    // Here you would generate PDF using a library like puppeteer or jsPDF
    // For now, we'll return a simple response
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`)

    // Mock PDF content - in production, generate actual PDF
    const pdfContent = `Invoice ${invoice.invoiceNumber} - ${invoice.customer.fullName}`
    res.send(Buffer.from(pdfContent))
  } catch (error) {
    console.error("Download invoice error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to download invoice",
    })
  }
})

// Create invoice from order (admin only)
router.post("/from-order/:orderId", admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("customer").populate("items.product")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      })
    }

    if (order.invoice) {
      return res.status(400).json({
        success: false,
        message: "Invoice already exists for this order",
      })
    }

    // Create invoice from order data
    const invoiceData = {
      customer: {
        fullName: order.customer.fullName,
        phoneNumber: order.customer.phoneNumber,
        email: order.customer.email,
        address: order.deliveryAddress,
      },
      items: order.items.map((item) => ({
        product: item.product._id,
        productName: item.product.name,
        description: item.product.description,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.quantity * item.price,
      })),
      subtotal: order.total,
      total: order.total,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      order: order._id,
      createdBy: req.user.userId,
    }

    const invoice = new Invoice(invoiceData)
    await invoice.save()

    // Update order with invoice reference
    order.invoice = invoice._id
    await order.save()

    await invoice.populate("createdBy", "fullName")

    res.status(201).json({
      success: true,
      message: "Invoice created from order successfully",
      invoice,
    })
  } catch (error) {
    console.error("Create invoice from order error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create invoice from order",
    })
  }
})

module.exports = router;
