const Booking = require('../models/booking');
const createNewBooking = async (req, res) => {
    try {
        console.log("Creating new booking with data:", req.body);

        const { items, total, deliveryAddress, paymentMethod, notes, fullName, email, phone } = req.body;

        // Validate required fields
        if (!deliveryAddress || !deliveryAddress.governorate || !deliveryAddress.area) {
            return res.status(400).json({
                success: false,
                message: "Delivery address with governorate and area is required",
            });
        }

        if (!fullName || !phone || !email) {
            return res.status(400).json({
                success: false,
                message: "Full name, phone, and email are required for booking",
            });
        }

        const newBookingData = {
            customerInfo: {
                fullName,
                email,
                phone,
            },
            items,
            total,
            deliveryAddress,
            paymentMethod,
            notes: notes || "",
            status: "pending",
        };

        console.log("New booking data:", newBookingData);

        const newBooking = await Booking.create(newBookingData);

        console.log("New booking created:", newBooking);

        res.status(201).json({
            success: true,
            message: "Booking placed successfully",
            booking: newBooking,
        });
    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create booking",
        });
    }
}

const getAllBookings = async (req, res) => {
    try {
        const { startDate, endDate, search } = req.query;

        let filter = {};

        // Filter by date range if provided
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        // Filter by search term in customerInfo.fullName or customerInfo.email
        if (search) {
            filter.$or = [
                { "customerInfo.fullName": { $regex: search, $options: "i" } },
                { "customerInfo.email": { $regex: search, $options: "i" } },
                { "customerInfo.phone": { $regex: search, $options: "i" } },
            ];
        }


        const bookings = await Booking.find(filter).sort({ createdAt: -1 }).lean();

        res.json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
        });
    }
};

module.exports = {
    createNewBooking,
    getAllBookings
};
