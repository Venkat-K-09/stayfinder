const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  location: { type: String, required: true },
  photos: [String],
  description: { type: String, required: true },
  perks: [String],
  extraInfo: String,
  checkIn: { type: Number, default: 14 },
  checkOut: { type: Number, default: 11 },
  maxGuests: { type: Number, default: 2 },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['beach', 'mountain', 'city', 'countryside', 'cabin', 'other'],
    default: 'other',
  },
}, { timestamps: true })

module.exports = mongoose.model('Place', placeSchema)
