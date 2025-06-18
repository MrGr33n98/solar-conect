const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport'); // You might initialize passport in server.js instead
const { User } = require('../models'); // Adjust path if your models/index.js is elsewhere or User model directly
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Ensure JWT_SECRET is loaded for signing

const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'user' // Default to 'user' if role not provided
    });

    // Respond (excluding passwordHash)
    res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    });

  } catch (error) {
    console.error('Registration error:', error);
    // Check for Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ message: 'Validation error', errors: messages });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Middleware for protecting routes
const requireAuth = passport.authenticate('jwt', { session: false });

// Sample Protected Route: GET /api/users/me
// This route will use the 'requireAuth' middleware
router.get('/me', requireAuth, (req, res) => {
  // If requireAuth passes, req.user will be populated by the passport JWT strategy
  // (with the user object from the database)
  if (req.user) {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      // Do NOT send passwordHash or other sensitive data
    });
  } else {
    // This case should ideally not be reached if requireAuth is effective
    // and passport strategy is correctly configured.
    res.status(401).json({ message: 'Unauthorized: User not found after authentication.' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
    }

    // User matched, create JWT payload
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Sign token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour, adjust as needed
    );

    res.json({
      message: 'Login successful!',
      token: `Bearer ${token}` // Standard way to format the token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;
