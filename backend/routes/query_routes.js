const express = require("express");

const { createNewQuery, getAllQueries, updateQueryStatus } = require("../controllers/queries_controller");
const { admin } = require("../middleware/checkAdmin");
const { authMiddleware } = require("../controllers/auth_controller");

const router = express.Router();

router.post("/", createNewQuery);
router.get("/admin",authMiddleware, admin, getAllQueries);
router.put("/:id/status", authMiddleware, admin, updateQueryStatus);

module.exports = router;
