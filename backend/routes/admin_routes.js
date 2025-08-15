const express = require('express');
const router = express.Router();
const { getAllUsers, getAdminStats } = require("../controllers/admin_controller");

router.get('/users', getAllUsers);
router.get("/stats", getAdminStats);

module.exports = router;
