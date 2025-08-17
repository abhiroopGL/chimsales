const { Product, ProductImage } = require("../models");
const { Op } = require("sequelize");

// Create product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, featured, category } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            featured: featured === "true" || featured === true,
            category
        });

        // Save images separately
        if (req.files && req.files.length > 0) {
            const imagesData = req.files.map(file => ({
                productId: product.id,
                url: `/uploads/products/${file.filename}`
            }));
            await ProductImage.bulkCreate(imagesData);
        }

        const productWithImages = await Product.findByPk(product.id, {
            include: [{ model: ProductImage, as: "images" }]
        });

        return res.status(201).json({ success: true, product: productWithImages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                featured: true,
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

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the existing product along with images
        const existingProduct = await Product.findByPk(id, {
            include: [{ model: ProductImage, as: "images" }]
        });

        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Prepare updates for basic fields
        const updates = {};
        for (const key in req.body) {
            if (key === "imagesToDelete") continue; // skip deletion field
            if (req.body[key] != existingProduct[key]) {
                if (key === "featured") {
                    updates[key] = req.body[key] === "true" || req.body[key] === true;
                } else {
                    updates[key] = req.body[key];
                }
            }
        }

        if (Object.keys(updates).length > 0) {
            await existingProduct.update(updates);
        }

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({
                productId: existingProduct.id,
                url: `/uploads/products/${file.filename}`
            }));
            await ProductImage.bulkCreate(newImages);
        }

        // Handle image deletions
        if (req.body.imagesToDelete) {
            let idsToDelete = req.body.imagesToDelete;
            if (typeof idsToDelete === "string") {
                // parse JSON string from frontend
                idsToDelete = JSON.parse(idsToDelete);
            }

            await ProductImage.destroy({
                where: {
                    productId: existingProduct.id,
                    id: idsToDelete
                }
            });
        }

        // Fetch updated product
        const updatedProduct = await Product.findByPk(id, {
            include: [{ model: ProductImage, as: "images" }]
        });

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

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

module.exports = {
    createProduct,
    getAdminProducts,
    getPublicProducts,
    getFeaturedProducts,
    fetchProductById,
    updateProduct,
    deleteProduct,
    restoreProduct
};
