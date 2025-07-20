const express = require("express");
const { getOrders, createNewOrder } = require("../controllers/order_controller.js")

const router = express.Router();


// Create new order
router.post("/", createNewOrder)

// Get user orders
router.get("/admin", getOrders);

module.exports = router;
