const Booking = require('../models/Booking')
const Place = require('../models/Place')

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { placeId, checkIn, checkOut, name, phone, guests } = req.body
    const place = await Place.findById(placeId)
    if (!place) return res.status(404).json({ message: 'Place not found' })

    // Prevent owner from booking their own place
    if (place.owner.toString() === req.user._id.toString())
      return res.status(400).json({ message: "You can't book your own listing" })

    // Check availability
    const conflict = await Booking.findOne({
      place: placeId, status: 'confirmed',
      $or: [
        { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
        { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } },
      ],
    })
    if (conflict) return res.status(400).json({ message: 'These dates are already booked' })

    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
    const price = nights * place.price

    const booking = await Booking.create({
      place: placeId, user: req.user._id,
      checkIn, checkOut, name, phone,
      guests: guests || 1, price,
    })
    const populated = await booking.populate('place', 'title photos address location price')
    res.status(201).json(populated)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('place', 'title photos address location price')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' })
    booking.status = 'cancelled'
    await booking.save()
    res.json(booking)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

module.exports = { createBooking, getUserBookings, cancelBooking }
