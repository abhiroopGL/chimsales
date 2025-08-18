const { Product, ProductImage } = require("../models");
const { Op } = require("sequelize");
const cloudinary = require('../config/cloudinary');

// Create product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, featured, category } = req.body;

        // First create product (without images)
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            featured: featured === "true" || featured === true,
            category,
        });

        // Upload images to Cloudinary
        console.log("Files:", req.files)
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
                    folder: `products/${product.id}`,
                    resource_type: "image",
                })
            );
            const uploadResults = await Promise.all(uploadPromises);
            console.log("Results", uploadResults)

            const imagesData = uploadResults.map((result) => ({
                productId: product.id,
                url: result.secure_url,   // Cloudinary hosted URL
                publicId: result.public_id, // Store this if you want to delete image later
            }));

            await ProductImage.bulkCreate(imagesData);
        }

        // Get product with images
        const productWithImages = await Product.findByPk(product.id, {
            include: [{ model: ProductImage, as: "images" }],
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
    const t = await Product.sequelize.transaction(); // start transaction

    try {
        const { id } = req.params;

        // Fetch existing product with images
        const existingProduct = await Product.findByPk(id, {
            include: [{ model: ProductImage, as: "images" }],
            transaction: t
        });

        if (!existingProduct) {
            await t.rollback();
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

        // Update basic product fields
        if (Object.keys(updates).length > 0) {
            await existingProduct.update(updates, { transaction: t });
        }

        // Handle images to delete
        if (req.body.imagesToDelete) {
            let idsToDelete = req.body.imagesToDelete;
            if (typeof idsToDelete === "string") {
                idsToDelete = JSON.parse(idsToDelete);
            }

            // Find images to delete and remove from Cloudinary
            const imagesToDelete = await ProductImage.findAll({
                where: { productId: existingProduct.id, id: idsToDelete },
                transaction: t
            });

            for (const img of imagesToDelete) {
                if (img.publicId) {
                    await cloudinary.uploader.destroy(img.publicId);
                }
            }

            // Delete from DB
            await ProductImage.destroy({
                where: { productId: existingProduct.id, id: idsToDelete },
                transaction: t
            });
        }

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file, idx) =>
                cloudinary.uploader.upload(
                    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                    {
                        folder: `products/${existingProduct.id}`,
                        resource_type: "image",
                        public_id: `img_${Date.now()}_${idx}`
                    }
                )
            );

            const uploadResults = await Promise.all(uploadPromises);

            const newImagesData = uploadResults.map(result => ({
                productId: existingProduct.id,
                url: result.secure_url,
                publicId: result.public_id
            }));

            await ProductImage.bulkCreate(newImagesData, { transaction: t });
        }

        // Commit transaction
        await t.commit();

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
        await t.rollback(); // rollback if anything fails
        res.status(500).json({ success: false, message: error.message || "Server error" });
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
