const express = require('express');
const router = express.Router();
const { createNewBooking, getAllBookings, updateBookingStatus } = require('../controllers/booking_controller.js');
const { admin } = require('../middleware/checkAdmin.js');
const { authMiddleware } = require('../controllers/auth_controller.js');
router.post('/', createNewBooking);
router.get("/", authMiddleware, admin, getAllBookings);
router.patch("/:id/status", authMiddleware, admin, updateBookingStatus);

module.exports = router;
