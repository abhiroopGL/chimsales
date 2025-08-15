const { Invoice, User, Order, InvoiceItem } = require("../models");
const { Op } = require("sequelize");

// Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { search, status } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) filter.invoiceNumber = { [Op.iLike]: `%${search}%` };

    const totalCount = await Invoice.count({ where: filter });

    const invoices = await Invoice.findAll({
      where: filter,
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      include: [
        { model: User, as: 'createdBy', attributes: ['fullName'], as: 'createdBy' }, // alias must match model association
      ]
    });

    res.json({
      success: true,
      invoices,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch invoices" });
  }
};

// Get single invoice
const getSingleInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'createdBy',
          attributes: ['fullName', 'phone', 'email'],
        },
        {
          model: InvoiceItem,
          as: 'items',
          attributes: ['productName', 'description', 'quantity', 'unitPrice', 'total']
        }
      ]
    });

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    // Security check for non-admins
    if (req.user.role !== "admin" && invoice.customerPhone !== req.user.phoneNumber) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, invoice });
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch invoice" });
  }
};

// Create new invoice
const createNewInvoice = async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne({
      order: [['id', 'DESC']],
    });
    const nextNumber = `INV-${(lastInvoice?.id ?? 0) + 1}`;

    const invoiceData = {
      invoiceNumber: req.body.invoiceNumber || nextNumber,
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      subtotal: req.body.subtotal || 0,
      taxRate: req.body.taxRate || 0,
      taxAmount: req.body.taxAmount || 0,
      discountRate: req.body.discountRate || 0,
      discountAmount: req.body.discountAmount || 0,
      total: req.body.total || 0,
      dueDate: req.body.dueDate,
      notes: req.body.notes || "",
      terms: req.body.terms || "Payment is due within 30 days of invoice date.",
      status: "draft",
      createdById: req.user.id,
      items: req.body.items || [], // <-- pass items array
    };

    console.log("Creating invoice with data:", invoiceData);

    const invoice = await Invoice.create(invoiceData, {
      include: [{ model: InvoiceItem, as: 'items' }] // <-- use alias 'items'
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      invoice
    });
  } catch (error) {
    console.error("Create invoice error:", error);
    res.status(500).json({ success: false, message: "Failed to create invoice", error: error.message });
  }
};


// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const [updatedRows, [updatedInvoice]] = await Invoice.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });

    if (!updatedInvoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    res.json({ success: true, message: "Invoice updated successfully", invoice: updatedInvoice });
  } catch (error) {
    console.error("Update invoice error:", error);
    res.status(500).json({ success: false, message: "Failed to update invoice" });
  }
};


const deleteInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    // Try to delete
    const deletedCount = await Invoice.destroy({
      where: { id: invoiceId }
    });

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete invoice",
    });
  }

}

module.exports = { getAllInvoices, getSingleInvoice, createNewInvoice, updateInvoice, deleteInvoice };
