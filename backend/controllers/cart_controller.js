const { Cart, CartItem, Product } = require('../models');
const { Sequelize } = require('sequelize');

// Get cart
const getCart = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(200).json({
            status: 'success',
            message: 'Login to see your cart',
            data: { items: [], total: 0 }
        });
    }

    const cart = await Cart.findOne({
        where: { userId: req.user.id },
        include: { model: CartItem, include: Product }
    });

    if (!cart || !cart.CartItems.length) {
        return res.status(200).json({
            status: 'success',
            data: { items: [], total: 0 }
        });
    }

    const total = cart.CartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.status(200).json({
        status: 'success',
        data: { items: cart.CartItems, total }
    });
};

// Add to cart
const addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    let cart = await Cart.findOrCreate({ where: { userId: req.user.id } });
    cart = cart[0];

    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });

    if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
    } else {
        cartItem = await CartItem.create({
            cartId: cart.id,
            productId,
            quantity,
            price: product.price,
            name: product.name,
            image: product.image
        });
    }

    res.status(200).json({ status: 'success', data: { cart, cartItem } });
};

// Update cart item
const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });

    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (!cartItem) return res.status(404).json({ message: "Item not found in cart" });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ status: 'success', data: cartItem });
};

// Remove from cart
const removeFromCart = async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await CartItem.destroy({ where: { cartId: cart.id, productId } });

    res.status(200).json({ status: 'success', message: "Item removed" });
};

// Clear cart
const clearCart = async (req, res) => {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(200).json({ status: 'success', message: "Cart cleared" });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
