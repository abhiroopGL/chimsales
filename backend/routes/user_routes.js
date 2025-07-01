const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, authMiddleware, updateProfile, checkAuth} = require("../controllers/auth_controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, checkAuth);
router.put('/profile', authMiddleware, updateProfile);


module.exports = router;
