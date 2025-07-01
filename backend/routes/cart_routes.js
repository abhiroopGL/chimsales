// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const { getCart, clearCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cart_controller');

// Protect all cart routes

router.get('/', getCart);
router.post('/add', addToCart);
router.patch('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;