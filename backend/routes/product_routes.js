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

// Multer memory storage (no saving to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create", upload.array("images", 10), createProduct);
router.get("/admin", getAdminProducts);
router.get("/public", getPublicProducts);
router.get("/find/:id", fetchProductById);
router.put("/update/:id", upload.array("images", 10), updateProduct);
router.delete("/delete/:id", deleteProduct);
router.patch("/restore/:id", restoreProduct);
router.get("/featured", getFeaturedProducts);

module.exports = router;
