const Place = require('../models/Place')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// GET /api/places  (with search + filters)
const getPlaces = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, category, guests } = req.query
    const query = {}

    if (location) query.$or = [
      { location: { $regex: location, $options: 'i' } },
      { address: { $regex: location, $options: 'i' } },
      { title: { $regex: location, $options: 'i' } },
    ]
    if (category) query.category = category
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }
    if (guests) query.maxGuests = { $gte: Number(guests) }

    const places = await Place.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
    res.json(places)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/places/owner/myplaces
const getMyPlaces = async (req, res) => {
  try {
    res.json(await Place.find({ owner: req.user._id }).sort({ createdAt: -1 }))
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// GET /api/places/:id
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id).populate('owner', 'name email')
    if (!place) return res.status(404).json({ message: 'Place not found' })
    res.json(place)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// POST /api/places
const createPlace = async (req, res) => {
  try {
    const { title, address, location, description, perks, extraInfo, checkIn, checkOut, maxGuests, price, category } = req.body

    let photoUrls = []
    if (req.files?.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'stayfinder' })
        photoUrls.push(result.secure_url)
        fs.unlinkSync(file.path)
      }
    }

    const place = await Place.create({
      owner: req.user._id, title, address, location,
      photos: photoUrls, description,
      perks: perks ? perks.split(',').filter(Boolean) : [],
      extraInfo,
      checkIn: Number(checkIn), checkOut: Number(checkOut),
      maxGuests: Number(maxGuests), price: Number(price), category,
    })
    res.status(201).json(place)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// DELETE /api/places/:id
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
    if (!place) return res.status(404).json({ message: 'Place not found' })
    if (place.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' })
    await place.deleteOne()
    res.json({ message: 'Listing deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

module.exports = { getPlaces, getMyPlaces, getPlaceById, createPlace, deletePlace }
