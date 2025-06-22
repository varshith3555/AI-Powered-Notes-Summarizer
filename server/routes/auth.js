const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');

// Register new user
router.post('/register', validateRegistration, register);

// Login user
router.post('/login', validateLogin, login);

// Get current user profile (protected)
router.get('/profile', auth, getProfile);

// Update user profile (protected)
router.put('/profile', auth, updateProfile);

module.exports = router; 