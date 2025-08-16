const { Booking, BookingItem, Product, ProductImage } = require("../models");
const { Op, Sequelize } = require('sequelize');

// Create new booking
const createNewBooking = async (req, res) => {
    try {
        const { items,
            total,
            deliveryArea,
            deliveryStreet,
            deliveryGovernorate,
            paymentMethod,
            notes,
            fullName,
            email,
            phone,
            deliveryBlock,
            deliveryBuilding,
            deliveryFloor,
            deliveryApartment } = req.body;

        console.log("Body: ", req.body)
        // Validation
        if (!deliveryArea || !deliveryGovernorate) {
            return res.status(400).json({ success: false, message: "Delivery address area and governorate are required" });
        }
        if (!fullName || !phone) {
            return res.status(400).json({ success: false, message: "Full name, phone, and email are required" });
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Booking items are required" });
        }

        // Create the Booking
        const newBooking = await Booking.create({
            customerFullName: fullName,
            customerEmail: email,
            customerPhone: phone,
            total,
            deliveryStreet: deliveryStreet || null,
            deliveryArea: deliveryArea,
            deliveryGovernorate: deliveryGovernorate,
            deliveryBlock: deliveryBlock || null,
            deliveryBuilding: deliveryBuilding || null,
            deliveryFloor: deliveryFloor || null,
            deliveryApartment: deliveryApartment || null,
            paymentMethod,
            notes: notes || "",
            status: "pending",
        });

        // Create associated BookingItems
        const bookingItemsData = items.map(item => ({
            bookingId: newBooking.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.unitPrice, // per unit price
        }));


        await BookingItem.bulkCreate(bookingItemsData);

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

        // Search filter on customer fields
        if (search) {
            where[Op.or] = [
                { customerFullName: { [Op.iLike]: `%${search}%` } },
                { customerEmail: { [Op.iLike]: `%${search}%` } },
                { customerPhone: { [Op.iLike]: `%${search}%` } },
            ];
        }

        const bookings = await Booking.findAll({
            where,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: BookingItem,
                    as: "items",
                    include: [
                        {
                            model: Product,
                            as: "product",
                            include: [
                                {
                                    model: ProductImage,
                                    as: "images",
                                    separate: true,
                                    limit: 1, // fetch only first image
                                    order: [["createdAt", "ASC"]],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        // Format response: add imageUrl field
        const formattedBookings = bookings.map((booking) => {
            const bookingJson = booking.toJSON();
            bookingJson.items = bookingJson.items.map((item) => ({
                ...item,
                product: {
                    ...item.product,
                    imageUrl: item.product.images[0]?.url || null,
                },
            }));
            return bookingJson;
        });

        res.json({ success: true, bookings: formattedBookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
    console.log("Body:", req.body);
    console.log("Params:", req.params);

    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id) return res.status(400).json({ success: false, message: "Booking ID is required" });
        if (!status) return res.status(400).json({ success: false, message: "Status is required" });

        // Update booking
        const booking = await Booking.findByPk(id);
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        booking.status = status;
        await booking.save();

        res.json({ success: true, booking });
    } catch (error) {
        console.error("Update booking status error:", error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};


module.exports = { createNewBooking, getAllBookings, updateBookingStatus };
