const { Product, ProductImage } = require("../models");
const { Op } = require("sequelize");

// Create product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            stock
        });

        // Save images separately
        if (req.files && req.files.length > 0) {
            const imagesData = req.files.map(file => ({
                productId: product.id,
                url: `/uploads/products/${file.filename}`
            }));
            await ProductImage.bulkCreate(imagesData);
        }

        // Fetch product with images
        const productWithImages = await Product.findByPk(product.id, {
            include: [{ model: ProductImage, as: "images" }]
        });

        return res.status(201).json({ success: true, product: productWithImages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get public products
const getPublicProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                status: "published",
                deleted: { [Op.ne]: true },
            },
            order: [["createdAt", "DESC"]],
            include: [{ model: ProductImage, as: "images" }]
        });

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get admin products
const getAdminProducts = async (req, res) => {
    try {
        const { filter } = req.query;
        let whereClause = {};
        if (filter && filter !== "all") {
            whereClause.status = filter;
        }

        const products = await Product.findAll({
            where: whereClause,
            order: [["createdAt", "DESC"]],
            include: [{ model: ProductImage, as: "images" }]
        });

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Fetch product by ID
const fetchProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [{ model: ProductImage, as: "images" }]
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const existingProduct = await Product.findByPk(id, {
            include: [{ model: ProductImage, as: "images" }]
        });

        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const updates = {};
        for (const key in req.body) {
            if (req.body[key] != existingProduct[key]) {
                updates[key] = req.body[key];
            }
        }

        // Update product fields
        if (Object.keys(updates).length > 0) {
            await existingProduct.update(updates);
        }

        // Handle images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                productId: existingProduct.id,
                url: `/uploads/products/${file.filename}`
            }));
            await ProductImage.bulkCreate(newImages);
        }

        // If frontend sends an array of images to keep, remove others
        if (req.body.imagesToKeep && Array.isArray(req.body.imagesToKeep)) {
            await ProductImage.destroy({
                where: {
                    productId: existingProduct.id,
                    id: { [Op.notIn]: req.body.imagesToKeep }
                }
            });
        }

        const updatedProduct = await Product.findByPk(id, {
            include: [{ model: ProductImage, as: "images" }]
        });

        return res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Soft delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) return res.status(404).json({ success: false, message: "Product not found" });
        if (product.deleted) return res.status(400).json({ success: false, message: "Product already deleted" });

        await product.update({
            deleted: true,
            deletedAt: new Date(),
            status: "deleted"
        });

        return res.status(200).json({ success: true, message: "Product deleted successfully (soft delete)", id });
    } catch (error) {
        console.error("Soft delete error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Restore product
const restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        await product.update({
            deleted: false,
            deletedAt: null,
            status: "draft"
        });

        return res.status(200).json({ success: true, message: "Product restored successfully", id });
    } catch (error) {
        console.error("Restore error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { createProduct, getAdminProducts, getPublicProducts, fetchProductById, updateProduct, deleteProduct, restoreProduct };
