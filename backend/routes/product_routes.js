const path = require('path');
const multer = require("multer");
const express = require("express");
const router = express.Router();
const { createProduct, getProducts, fetchProductById, updateProduct, deleteProduct} = require("../controllers/product_controller")

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve('/Users/abhiroop.panchal/Documents/Node/ChimSales/frontend/public/uploads/products'));    // Folder to save
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now() + '-' + Math.round(Math.random() * 1E9)}.png`;
        console.log("FileName is: ", fileName);
        cb(null, fileName);
    }
});


const upload = multer({ storage });

router.post("/create", upload.array('images', 10), createProduct);
router.get("/", getProducts);
router.get("/find/:id", fetchProductById);
router.put("/update/:id", upload.array('images', 10), updateProduct)
router.delete("/delete/:id", deleteProduct);


module.exports = router;
