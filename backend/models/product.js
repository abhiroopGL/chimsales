const mongoose =  require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    images: [String], // Array of image URLs
    status: { type: String, enum: ['draft', 'deploy'], default: 'draft' },
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
