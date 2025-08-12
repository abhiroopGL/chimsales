const express = require('express');
const router = express.Router();
const { createNewBooking, getAllBookings } = require('../controllers/booking_controller.js');
router.post('/', createNewBooking);
router.get("/", getAllBookings);

module.exports = router;
