const Product = require("../models/product");

const createProduct = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const images = req.files.map(file => `/uploads/products/${file.filename}`);
        const product = new Product({ name, description, price, images });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const { filter } = req.query;
        const query = { deleted: filter === 'deleted' };
        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createProduct, getProducts };