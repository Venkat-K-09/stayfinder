const router = require('express').Router()
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createBooking)
router.get('/', protect, getUserBookings)
router.put('/:id/cancel', protect, cancelBooking)

module.exports = router
