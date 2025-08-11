const Invoice = require("../models/invoice.js")
const Order = require("../models/order.js")

const getAllInvoices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { search, status } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.invoiceNumber = { $regex: escapedSearch, $options: "i" };
    }

    const totalCount = await Invoice.countDocuments(filter);

    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "fullName")
      .populate("order");

    res.json({
      success: true,
      invoices,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch invoices",
    });
  }
};


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