const User = require("../models/User");

const getAllUsers = async (req, res) => {
    const users = await User.find({});
    console.log("Users are:",users);
    res.status(200).json(users);
}

module.exports = { getAllUsers }