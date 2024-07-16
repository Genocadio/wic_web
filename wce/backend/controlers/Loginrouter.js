const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
  const { identifier, password } = req.body;

  // Validate input
  if (!password || !identifier) {
    return res.status(400).json({
      error: 'Identifier (Email or Phone Number) and Password are required'
    });
  }

  // Find the user by either email or phone number
  const user = await User.findOne({
    $or: [
      { email: identifier },
      { phoneNumber: identifier }
    ]
  });

  // Check if user exists and if the password matches
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'Invalid identifier (email/phone number) or password'
    });
  }

  const userForToken = {
    email: user.email,
    id: user._id
  };

  // Generate JWT token
  console.log('in Login', process.env.SECRET);
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });

  res.status(200).send({
    token,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userType: user.userType,
    state: user.status,
    id: user._id // Changed to user._id for consistency
  });
});

module.exports = loginRouter;
