const { Order, User, Product, Invoice, OrderItem } = require("../models");
const { Op } = require("sequelize");

// Get all orders with pagination and filters
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { search, status, date } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { [Op.between]: [start, end] };
    }
    if (search) filter.orderNumber = { [Op.iLike]: `%${search}%` };

    const totalCount = await Order.count({ where: filter });

    const orders = await Order.findAll({
      where: filter,
      order: [["createdAt", "DESC"]],
      offset,
      limit,
      include: [
        { model: User, as: "customer", attributes: ["fullName", "phone"] },
        // { model: Invoice }
      ]
    });

    res.json({
      success: true,
      orders,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [
        { model: User, as: "customer", attributes: ["fullName", "phone", "email"] },
        { 
          model: OrderItem, 
          include: [{ model: Product, attributes: ["name", "price", "images"] }] 
        },
        { model: Invoice }
      ]
    });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch the order" });
  }
};

// Create new order
const createNewOrder = async (req, res) => {
  try {
    const { items, total, deliveryAddress, paymentMethod, notes } = req.body;
    const user = await User.findByPk(req.user.id);

    // Create order
    const newOrder = await Order.create({
      customerId: req.user.id,
      total,
      deliveryAddress,
      paymentMethod,
      notes: notes || "",
      status: "pending"
    });

    // Create order items
    const resolvedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        return {
          orderId: newOrder.id,
          productId: product.id,
          productName: product.name,
          description: product.description || "",
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.quantity * item.price
        };
      })
    );

    await OrderItem.bulkCreate(resolvedItems);

    // Auto-generate invoice
    try {
      const invoice = await Invoice.create({
        customerName: user.fullName,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerAddress: deliveryAddress,
        items: resolvedItems,
        subtotal: total,
        total: total,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        orderId: newOrder.id,
        createdById: user.id,
        status: "sent"
      });
      newOrder.invoiceId = invoice.id;
      await newOrder.save();
    } catch (invoiceError) {
      console.error("Failed to create invoice for order:", invoiceError);
    }

    res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// Update order
const updateOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus, notes } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    const updatedOrder = await Order.findByPk(orderId, {
      include: [
        { model: User, as: "customer", attributes: ["fullName", "phone", "email"] },
        { model: OrderItem, include: [{ model: Product, attributes: ["name", "price", "images"] }] },
        { model: Invoice }
      ]
    });

    res.json({ success: true, message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};

module.exports = { getOrders, getOrderById, createNewOrder, updateOrderById };
