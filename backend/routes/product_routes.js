const path = require('path');
const multer = require("multer");
const express = require("express");
const router = express.Router();
const { createProduct, getAdminProducts, getPublicProducts, fetchProductById, updateProduct, deleteProduct,
    restoreProduct
} = require("../controllers/product_controller")

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Replace this below path with wherever you want to store images
        cb(null, path.resolve('/Users/abhiroop.panchal/Documents/Node/Projects/chimsales/frontend/public/uploads/products'));    // Folder to save
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now() + '-' + Math.round(Math.random() * 1E9)}.png`;
        cb(null, fileName);
    }
});


const upload = multer({ storage });

router.post("/create", upload.array('images', 10), createProduct);
router.get("/admin", getAdminProducts);
router.get("/public", getPublicProducts);
router.get("/find/:id", fetchProductById);
router.put("/update/:id", upload.array('images', 10), updateProduct)
router.delete("/delete/:id", deleteProduct);
router.patch("/restore/:id", restoreProduct);


module.exports = router;
