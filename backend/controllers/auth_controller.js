const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

//register
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkUser = await User.findOne({ where: { email } });
        if (checkUser)
            return res.json({
                success: false,
                message: "User already exists with this email! Please try again",
            });

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            email,
            password: hashPassword,
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
        });
    } catch (e) {
        console.error("Registration error:", e);
        res.status(500).json({
            success: false,
            message: "Some error occurred",
        });
    }
};

//login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("Request Body:", req.body)

    try {
        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.json({
                success: false,
                message: "User doesn't exist! Please register first",
            });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.json({
                success: false,
                message: "Incorrect password! Please try again",
            });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "abhiroop",
            { expiresIn: "60m" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production
            sameSite: "none",  // required for cross-domain cookies
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days in milliseconds
        }).json({
            success: true,
            message: "Logged in successfully",
            user: { id: user.id, email: user.email, role: user.role },
        });
    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({ success: false, message: "Some error occurred" });
    }
};

//logout
const logoutUser = (req, res) => {
    res.clearCookie("token").json({
        success: true,
        message: "Logged out successfully!",
    });
};

// auth middleware
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ success: false, message: "Unauthorized user!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "abhiroop");
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.clearCookie("token");
            return res.status(401).json({ success: false, message: "Session expired. Please login again." });
        }
        res.status(401).json({ success: false, message: "Unauthorized user!" });
    }
};

//update profile
const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { fullName, dateOfBirth, profilePicture } = req.body;

    try {
        const [updatedCount, [updatedUser]] = await User.update(
            { fullName, dateOfBirth, profilePicture },
            { where: { id: userId }, returning: true }
        );

        if (updatedCount === 0)
            return res.status(404).json({ success: false, message: "User not found" });

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: { id: updatedUser.id, email: updatedUser.email, fullName: updatedUser.fullName },
        });
    } catch (e) {
        console.error("Profile update error:", e);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
};

// check auth
const checkAuth = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (e) {
        console.error("Check auth error:", e);
        res.status(500).json({ success: false, message: "Error fetching user" });
    }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware, updateProfile, checkAuth };
