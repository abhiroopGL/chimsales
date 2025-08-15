const { User } = require("../models");
const { Op } = require("sequelize");

const getAllUsers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;

    // Convert to numbers safely
    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 100);
    const offset = (pageNum - 1) * limitNum;

    // Build filter for partial case-insensitive match
    const whereClause = search
      ? {
        [Op.or]: [
          { fullName: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      }
      : {};

    // Get total count
    const total = await User.count({ where: whereClause });

    // Fetch paginated users
    const users = await User.findAll({
      where: whereClause,
      offset,
      limit: limitNum,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      users,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllUsers };
