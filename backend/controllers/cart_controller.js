// backend/controllers/cartController.js
const Cart = require('../models/cart');
const Product = require('../models/product');

const getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        return res.status(200).json({
            status: 'success',
            data: {
                items: [],
                total: 0
            }
        });
    }

    res.status(200).json({
        status: 'success',
        data: cart.items
    });
}

const addToCart = async (req, res) => {
    console.log("Add to cart called:",req.body);
    const { productId, quantity = 1 } = req.body;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
        console.log("Product not found!")
    }

    // Find existing cart or create new one
    let cart = await Cart.findOne({ user: req.user.id });
    console.log("Cart:",cart);
    console.log("User:",req.user);
    if (!cart) {
        console.log("Creating new cart");
        cart = new Cart({ user: req.user._id, items: [] });
        console.log("Cart:",cart)
    }

    // Check if product already exists in cart

    const existingItem = cart.items.find(item =>
        item.product.toString() === productId
    );

    console.log("Existing item:",existingItem);

    if (existingItem) {
        // Update quantity if product exists
        existingItem.quantity += quantity;
    } else {
        // Add new item if product doesn't exist
        console.log("Adding new item", productId, quantity);
        cart.items.push({
            product: productId,
            quantity,
        });
        cart.user = req.user.id;
    }
    try {
        await cart.save();
        console.log("status:", res)
        res.status(200).json({
            status: 'success',
            data: cart
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred.",
        });
    }
}

const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
        console.log('Quantity must be at least 1');
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        console.log('Cart not found');
    }

    const itemIndex = cart.items.findIndex(item =>
        item.product.toString() === productId
    );

    if (itemIndex === -1) {
        console.log('Item not found in cart');
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
        status: 'success',
        data: cart
    });
}

const removeFromCart = async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        console.log('Cart not found');
    }

    cart.items = cart.items.filter(item =>
        item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
        status: 'success',
        data: cart
    });
}

const clearCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        console.log('Cart not found');
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
        status: 'success',
        data: cart
    });
}

module.exports = {getCart, clearCart, addToCart, updateCartItem, removeFromCart};