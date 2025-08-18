const mongoose =  require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    images: [String], // Array of image URLs
    status: { type: String, enum: ['draft', 'published', 'deleted'], default: 'draft' },
    deleted: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
