const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//register
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(req);
        const checkUser = await User.findOne({ email });
        if (checkUser)
            return res.json({
                success: false,
                message: "User Already exists with the same email! Please try again",
            });

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            // userName,
            email,
            password: hashPassword,
        });

        await newUser.save();
        res.status(200).json({
            success: true,
            message: "Registration successful",
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};

//login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const checkUser = await User.findOne({ email });
        if (!checkUser)
            return res.json({
                success: false,
                message: "User doesn't exists! Please register first",
            });

        const checkPasswordMatch = await bcrypt.compare(
            password,
            checkUser.password
        );
        if (!checkPasswordMatch)
            return res.json({
                success: false,
                message: "Incorrect password! Please try again",
            });

        const token = jwt.sign(
            {
                id: checkUser._id,
                // role: checkUser.role,
                email: checkUser.email,
                // userName: checkUser.userName,
            },
            "abhiroop",
            { expiresIn: "60m" }
        );

        res.cookie("token", token,
            { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: checkUser.email,
                // role: checkUser.role,
                id: checkUser._id,
                // userName: checkUser.userName,
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};

//logout

const logoutUser = (req, res) => {
    res.clearCookie("token").json({
        success: true,
        message: "Logged out successfully!",
    });
};

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({
            success: false,
            message: "Unauthorised user!"
        });

    try {
        console.log("Verifying token:",token);
        const decoded = jwt.verify(token, "abhiroop");
        console.log("Decoded:",decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Error:",error);
        if (error.name === "TokenExpiredError") {
            res.clearCookie("token");
            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again.",
            });
        }
        res.status(401).json({
            success: false,
            message: "Unauthorised user!",
        });
    }
};

const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { fullName, dateOfBirth, profilePicture } = req.body;
    console.log("Updating profile for user:", userId, "with data:", req.body);
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, dateOfBirth, profilePicture },
            { new: true, runValidators: true }
        );
        console.log("Updated user:", updatedUser);
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                email: updatedUser.email,
                userName: updatedUser.userName,
            },
        });
    } catch (e) {
        console.error("Error updating profile:", e);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
};

const checkAuth = async (req, res) => {
    try {
            console.log("User ID from request:", req.user.id);
            const user = await User.findById(req.user.id).select('-password');
            console.log("Fetched user:", user);
            if (!user) return res.status(404).json({ success: false, message: "User not found" });
            res.json({ success: true, user });
        } catch (e) {
            res.status(500).json({ success: false, message: "Error fetching user" });
        }
    }

module.exports = { registerUser, loginUser, logoutUser, authMiddleware, updateProfile, checkAuth };
