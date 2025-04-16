const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, authMiddleware} = require("../controllers/auth_controller");
// const {checkForAuthentication} = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/check-auth", authMiddleware);

module.exports = router;
