const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config()

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const placeRoutes = require('./routes/placeRoutes')
const bookingRoutes = require('./routes/bookingRoutes')

const app = express()

// Connect MongoDB
connectDB()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/places', placeRoutes)
app.use('/api/bookings', bookingRoutes)

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/stack-project/dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/stack-project/dist', 'index.html'))
  })
} else {
  app.get('/', (req, res) => res.send('StayFinder API running ✓'))
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
