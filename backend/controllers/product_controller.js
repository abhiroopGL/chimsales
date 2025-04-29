const Product = require("../models/product");

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const images = req.files.map(file => `/uploads/products/${file.filename}`);
        const product = new Product({ name, description, price, images, stock });
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

const fetchProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json(product)
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updates = {}; // This will store only modified fields

        // Loop through the fields sent in body
        for (const key in req.body) {
            const newValue = req.body[key];
            const oldValue = existingProduct[key];

            if (newValue != oldValue) {  // Loose comparison to handle types like '11' vs 11
                updates[key] = newValue;
            }
        }


        // Handle images separately if you're receiving uploaded files

        const imagesToKeep = req.body.images;
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
            updates.images = [
                ...(imagesToKeep || []),
                ...newImages
            ];
        }

        // If there are updates, update the document
        if (Object.keys(updates).length > 0) {
            await Product.findByIdAndUpdate(id, updates, { new: true });
            return res.status(200).json({ success: true, message: "Product updated successfully" });
        } else {
            return res.status(200).json({ success: true, message: "No changes detected" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = { createProduct, getProducts, fetchProductById, updateProduct };