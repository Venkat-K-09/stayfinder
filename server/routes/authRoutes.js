const router = require('express').Router()
const { registerUser, loginUser, logoutUser, getProfile } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.get('/profile', protect, getProfile)

module.exports = router
