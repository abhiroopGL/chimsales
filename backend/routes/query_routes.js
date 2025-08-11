const express = require("express");

const { createNewQuery, getAllQueries, updateQueryStatus } = require("../controllers/queries_controller");

const router = express.Router();

router.post("/", createNewQuery);
router.get("/admin", getAllQueries);
router.put("/:id/status", updateQueryStatus);

module.exports = router;
