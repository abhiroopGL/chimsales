const { Query } = require("../models");
const { Op } = require("sequelize");

// Create a new query (Contact Us form submission)
const createNewQuery = async (req, res) => {
  try {
    console.log("Creating new query:", req.body);
    const { fullName, phoneNumber, email, address, subject, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and message are required",
      });
    }

    console.log("Creating new query:", req.body);

    const newQuery = await Query.create({
      fullName,
      phoneNumber,
      email,
      address,
      subject,
      message,
      status: "pending", // default status
    });

    res.status(201).json({
      success: true,
      message: "Query submitted successfully",
      query: newQuery,
    });
  } catch (error) {
    console.error("Error creating query:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all queries (for admin) with pagination & filters
const getAllQueries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { search = "", status = "", date = "" } = req.query;

    const filters = {};

    if (search) {
      filters[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { subject: { [Op.iLike]: `%${search}%` } },
        { phoneNumber: { [Op.iLike]: `%${search}%` } },
        { message: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) filters.status = status;

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filters.createdAt = { [Op.between]: [startDate, endDate] };
    }

    const { rows: queries, count: totalCount } = await Query.findAndCountAll({
      where: filters,
      order: [["createdAt", "DESC"]],
      offset,
      limit,
    });

    res.json({
      success: true,
      queries,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update status of a query (admin)
const updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "in process", "resolved"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const query = await Query.findByPk(req.params.id);

    if (!query) {
      return res.status(404).json({ success: false, message: "Query not found" });
    }

    query.status = status;
    await query.save();

    res.json({
      success: true,
      message: "Status updated successfully",
      query,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createNewQuery,
  getAllQueries,
  updateQueryStatus,
};
