const { Booking } = require('../models');
const { Op, Sequelize } = require('sequelize');

// Create new booking
const createNewBooking = async (req, res) => {
    try {
        const { items, total, deliveryAddress, paymentMethod, notes, fullName, email, phone } = req.body;

        if (!deliveryAddress || !deliveryAddress.governorate || !deliveryAddress.area) {
            return res.status(400).json({ success: false, message: "Delivery address with governorate and area is required" });
        }

        if (!fullName || !phone || !email) {
            return res.status(400).json({ success: false, message: "Full name, phone, and email are required" });
        }

        const newBookingData = {
            customerInfo: { fullName, email, phone },
            items,
            total,
            deliveryAddress,
            paymentMethod,
            notes: notes || "",
            status: "pending",
        };

        const newBooking = await Booking.create(newBookingData);
        res.status(201).json({ success: true, message: "Booking placed successfully", booking: newBooking });
    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({ success: false, message: "Failed to create booking" });
    }
};

// Get all bookings with filters
const getAllBookings = async (req, res) => {
    try {
        const { startDate, endDate, search, status } = req.query;

        const where = {};

        // Date filter
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt[Op.gte] = new Date(startDate);
            if (endDate) where.createdAt[Op.lte] = new Date(endDate);
        }

        // Status filter
        if (status) where.status = status;

        // Search filter on JSONB field
        if (search) {
            where[Op.or] = [
                Sequelize.where(Sequelize.json('customerInfo.fullName'), { [Op.iLike]: `%${search}%` }),
                Sequelize.where(Sequelize.json('customerInfo.email'), { [Op.iLike]: `%${search}%` }),
                Sequelize.where(Sequelize.json('customerInfo.phone'), { [Op.iLike]: `%${search}%` }),
            ];
        }

        const bookings = await Booking.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) return res.status(400).json({ success: false, message: "Status is required" });

        const [updatedCount, [updatedBooking]] = await Booking.update(
            { status },
            { where: { id }, returning: true }
        );

        if (updatedCount === 0) return res.status(404).json({ success: false, message: "Booking not found" });

        res.json({ success: true, booking: updatedBooking });
    } catch (error) {
        console.error("Update booking status error:", error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};

module.exports = { createNewBooking, getAllBookings, updateBookingStatus };
