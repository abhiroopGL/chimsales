const Product = require("../models/product");

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const images = req.files.map(file => `/uploads/products/${file.filename}`);
        const product = new Product({ name, description, price, images, stock });
        await product.save();
        res.status(201).json({success: true, ...product});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getPublicProducts = async (req, res) => {
    try {
        const products = await Product.find({
            status: "deployed",
            deleted: { $ne: true },
        });

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const getAdminProducts = async (req, res) => {
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
        let imagesToKeep = Array.isArray(req.body.images) ? req.body.images : (req.body.images ? [req.body.images] : []);

        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
            updates.images = [
                ...(imagesToKeep || []),
                ...newImages
            ];
        } else {
            if (existingProduct.images.length != imagesToKeep.length) {
                updates.images = [...(imagesToKeep || [])];
            }
        }

        // If there are updates, update the document
        if (Object.keys(updates).length > 0) {
            product = await Product.findByIdAndUpdate(id, updates, { new: true });
            return res.status(200).json({ success: true, message: "Product updated successfully", product });
        } else {
            return res.status(200).json({ success: true, message: "No changes detected" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.deleted) {
            return res.status(400).json({ success: false, message: "Product already deleted" });
        }

        product.deleted = true;
        await product.save();

        return res.status(200).json({ success: true, message: "Product deleted successfully (soft delete)", id });
    } catch (error) {
        console.error("Soft delete error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = { createProduct, getAdminProducts, getPublicProducts, fetchProductById, updateProduct, deleteProduct };