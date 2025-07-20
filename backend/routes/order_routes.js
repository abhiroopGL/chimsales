const express = require("express");
const { getOrders, createNewOrder, getOrderById, updateOrderById } = require("../controllers/order_controller.js")

const router = express.Router();


// Create new order
router.post("/", createNewOrder)
router.get("/admin", getOrders);
router.get('/:orderId', getOrderById)
router.put('/:orderId', updateOrderById)


module.exports = router;
