const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'కૃપા કરી બધા ફીલ્ડ ભરો (Please fill all fields)' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'આ યુઝરનેમ અસ્તિત્વમાં છે (Username already exists)' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    await User.create({
      username,
      passwordHash,
    });

    res.status(201).json({
      message: 'નોંધણી સફળ રહી! (Registration successful!)',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      // Create token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'your_super_secret_key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.json({
        token,
        username: user.username,
        message: 'Login successful',
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  // Client side handles deleting the token. We can just send success status
  res.json({ message: 'Logout successful' });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
