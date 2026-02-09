const express = require('express');
const equipmentBookingController = require('../controllers/equipmentBookingController');

const router = express.Router();

// Equipment booking routes
router.get('/', equipmentBookingController.getAllBookings);
router.post('/', equipmentBookingController.createBooking);
router.get('/stats', equipmentBookingController.getBookingStats);
router.get('/member/:memberId', equipmentBookingController.getMemberBookings);
router.get('/:id', equipmentBookingController.getBooking);
router.put('/:id', equipmentBookingController.updateBooking);
router.post('/:id/confirm', equipmentBookingController.confirmBooking);
router.delete('/:id', equipmentBookingController.deleteBooking);

module.exports = router;
