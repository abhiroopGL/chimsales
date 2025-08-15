const mongoose = require("mongoose");

const bookingItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
});

const bookingSchema = new mongoose.Schema(
    {
        bookingNumber: {
            type: String,
            unique: true,
        },

        customerInfo: {
            fullName: {
                type: String,
                required: true,
                trim: true,
            },
            email: {
                type: String,
                trim: true,
                lowercase: true,
            },
            phone: {
                type: String,
                required: true,
                trim: true,
            },
        },

        items: [bookingItemSchema],

        total: {
            type: Number,
            required: true,
            min: 0,
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "card", "bank_transfer"],
            required: true,
            default: "cash",
        },

        deliveryAddress: {
            street: String,
            area: String,
            governorate: {
                type: String,
                required: true,
            },
            block: String,
            building: String,
            floor: String,
            apartment: String,
        },

        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Auto-generate booking number before save
bookingSchema.pre("save", async function (next) {
    if (!this.bookingNumber) {
        const count = await mongoose.model("Booking").countDocuments();
        this.bookingNumber = `BOOK-${String(count + 1).padStart(5, "0")}`;
    }
    next();
});

module.exports = mongoose.model("Booking", bookingSchema);
