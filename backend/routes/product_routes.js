const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
    createProduct,
    getAdminProducts,
    getPublicProducts,
    fetchProductById,
    updateProduct,
    deleteProduct,
    restoreProduct,
    getFeaturedProducts
} = require("../controllers/product_controller");
const { admin } = require("../middleware/checkAdmin");
const { authMiddleware } = require("../controllers/auth_controller");

// Multer memory storage (no saving to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create", authMiddleware, admin, createProduct);
router.get("/admin", authMiddleware, admin, getAdminProducts);
router.get("/public", getPublicProducts);
router.get("/find/:id", fetchProductById);
router.put("/update/:id", authMiddleware, admin, upload.array("images", 10), updateProduct);
router.delete("/delete/:id", authMiddleware, admin, deleteProduct);
router.patch("/restore/:id", authMiddleware, admin, restoreProduct);
router.get("/featured", getFeaturedProducts);

module.exports = router;
