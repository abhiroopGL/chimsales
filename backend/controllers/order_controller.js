const Order = require("../models/order");
const User = require("../models/User");
const Product = require("../models/product");
const Invoice = require("../models/invoice");
const orders = []
const getOrders = async (req, res) => {
    try {
        const userOrders = await Order.find({
            deleted: { $ne: true }
        });
        console.log("User orders are: ",userOrders);
        res.json({
          success: true,
          orders: userOrders,
        })
  } catch (error) {
    console.error("Get orders error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    })
  }
}

const createNewOrder = async (req, res) => {
    try {
          console.log("Creating new order with data:", req.body)
    
          const { items, total, deliveryAddress, paymentMethod, notes } = req.body

          console.log("User::", req.user);
          const user = await User.findById(req.user.id);
          console.log("User details:", user);

          const newOrder = await Order.create({
            customer: req.user.id,
            items,
            total,
            deliveryAddress,
            paymentMethod,
            notes: notes || "",
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          console.log("New order created:", newOrder)

          const resolvedItems = await Promise.all(
            items.map(async (item) => {
              const itm = await Product.findById(item.product);
              return {
                product: itm._id,
                productName: itm.name || "Product",
                description: itm.description || "",
                quantity: item.quantity,
                unitPrice: item.price,
                total: item.quantity * item.price,
              };
            })
          );

          // Auto-generate invoice for the order
          try {
            const invoiceData = {
              customer: {
                fullName: user.fullName,
                phoneNumber: user.phone,
                email: user.email,
                address: deliveryAddress,
              },
              items: resolvedItems,
              subtotal: total,
              total: total,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
              order: newOrder._id,
              createdBy: user._id,
              status: "sent", // Auto-send invoice for orders
            }

            const invoice = new Invoice(invoiceData)

            await invoice.save();
    
            newOrder.invoice = invoice._id
            await newOrder.save();
          } catch (invoiceError) {
            console.error("Failed to create invoice for order:", invoiceError)
            // Continue with order creation even if invoice fails
          }
    
          res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: newOrder,
          })
        } catch (error) {
          console.error("Create order error:", error)
          res.status(500).json({
            success: false,
            message: "Failed to create order",
          })
        }
}


module.exports = { getOrders, createNewOrder };