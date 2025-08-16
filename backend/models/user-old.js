const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profilePicture: { type: String, default: "" },
    deletedAt: { type: Date, default: null },
    deleted: { type: Boolean, default: false },
    dateOfBirth: { type: Date, default: null },
},{ timestamps: true });

module.exports = mongoose.model("User", userSchema);
