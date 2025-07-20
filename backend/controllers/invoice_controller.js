const Invoice = require("../models/invoice.js")
const Order = require("../models/order.js")

const getAllInvoices = async (req, res) => {
    try {
          const errors = validationResult(req)
          if (!errors.isEmpty()) {
            return res.status(400).json({
              success: false,
              message: "Validation error",
              errors: errors.array(),
            })
          }
    
          const { page = 1, limit = 20, status, search } = req.query
    
          // Build query
          const query = {}
    
          // Only admins can see all invoices, users see their own
          if (req.user.role !== "admin") {
            query["customer.phoneNumber"] = req.userDoc.phoneNumber
          }
    
          if (status) query.status = status
    
          if (search) {
            query.$or = [
              { invoiceNumber: { $regex: search, $options: "i" } },
              { "customer.fullName": { $regex: search, $options: "i" } },
              { "customer.phoneNumber": { $regex: search, $options: "i" } },
            ]
          }
    
          const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    
          const [invoices, total] = await Promise.all([
            Invoice.find(query)
              .sort({ createdAt: -1 })
              .skip(skip)
              .limit(Number.parseInt(limit))
              .populate("createdBy", "fullName")
              .populate("order"),
            Invoice.countDocuments(query),
          ])
    
          // Calculate stats for admin
          let stats = null
          if (req.user.role === "admin") {
            const [totalInvoices, paidInvoices, pendingInvoices, overdueInvoices] = await Promise.all([
              Invoice.countDocuments(),
              Invoice.countDocuments({ status: "paid" }),
              Invoice.countDocuments({ status: { $in: ["draft", "sent"] } }),
              Invoice.countDocuments({ status: "overdue" }),
            ])
    
            stats = {
              total: totalInvoices,
              paid: paidInvoices,
              pending: pendingInvoices,
              overdue: overdueInvoices,
            }
          }
    
          res.json({
            success: true,
            invoices,
            pagination: {
              currentPage: Number.parseInt(page),
              totalPages: Math.ceil(total / Number.parseInt(limit)),
              totalInvoices: total,
              hasNext: skip + invoices.length < total,
              hasPrev: Number.parseInt(page) > 1,
            },
            stats,
          })
        } catch (error) {
          console.error("Get invoices error:", error)
          res.status(500).json({
            success: false,
            message: "Failed to fetch invoices",
          })
        }
}

const getSingleInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("createdBy", "fullName").populate("order")
    
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
    
        res.json({
          success: true,
          invoice,
        })
      } catch (error) {
        console.error("Get invoice error:", error)
        res.status(500).json({
          success: false,
          message: "Failed to fetch invoice",
        })
      }
}


const createNewInvoice = async (req, res) => {
    try {
          const errors = validationResult(req)
          if (!errors.isEmpty()) {
            return res.status(400).json({
              success: false,
              message: "Validation error",
              errors: errors.array(),
            })
          }
    
          const invoiceData = {
            ...req.body,
            createdBy: req.user.userId,
          }
    
          const invoice = new Invoice(invoiceData)
          await invoice.save()
    
          await invoice.populate("createdBy", "fullName")
    
          res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            invoice,
          })
        } catch (error) {
          console.error("Create invoice error:", error)
          res.status(500).json({
            success: false,
            message: "Failed to create invoice",
          })
        }
}


const updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        }).populate("createdBy", "fullName")
    
        if (!invoice) {
          return res.status(404).json({
            success: false,
            message: "Invoice not found",
          })
        }
    
        res.json({
          success: true,
          message: "Invoice updated successfully",
          invoice,
        })
      } catch (error) {
        console.error("Update invoice error:", error)
        res.status(500).json({
          success: false,
          message: "Failed to update invoice",
        })
      }
}

module.exports = { getAllInvoices, getSingleInvoice, createNewInvoice, updateInvoice };