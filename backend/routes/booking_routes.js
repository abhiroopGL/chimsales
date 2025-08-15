const express = require('express');
const router = express.Router();
const { createNewBooking, getAllBookings, updateBookingStatus } = require('../controllers/booking_controller.js');
router.post('/', createNewBooking);
router.get("/", getAllBookings);
router.patch("/:id/status", updateBookingStatus);

module.exports = router;
