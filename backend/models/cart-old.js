// backend/models/Cart.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    name: String,
    price: Number,
    image: String
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema],
    total: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Calculate total before saving
cartSchema.pre('save', function(next) {
    console.log("pre save", this.items);
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    next();
});

module.exports = mongoose.model('Cart', cartSchema);