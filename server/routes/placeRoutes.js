const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { getPlaces, getMyPlaces, getPlaceById, createPlace, deletePlace } = require('../controllers/placeController')
const { protect } = require('../middleware/authMiddleware')

// Ensure uploads folder exists
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase())
    ok ? cb(null, true) : cb(new Error('Images only'))
  },
})

router.get('/', getPlaces)
router.get('/owner/myplaces', protect, getMyPlaces)
router.get('/:id', getPlaceById)
router.post('/', protect, upload.array('photos', 10), createPlace)
router.delete('/:id', protect, deletePlace)

module.exports = router
