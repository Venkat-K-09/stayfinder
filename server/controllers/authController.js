const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

const setCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

// POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body
  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'An account with this email already exists' })

    const user = await User.create({ name, email, password })
    setCookie(res, generateToken(user._id))
    res.status(201).json({ _id: user._id, name: user.name, email: user.email })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' })

    setCookie(res, generateToken(user._id))
    res.json({ _id: user._id, name: user.name, email: user.email })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/auth/logout
const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  })
  res.json({ message: 'Logged out' })
}

// GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    res.json(await User.findById(req.user._id).select('-password'))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { registerUser, loginUser, logoutUser, getProfile }
