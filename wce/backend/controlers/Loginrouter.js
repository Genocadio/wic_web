const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require ('dotenv').config();


const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid email or password'
    });
  }

  const userForToken = {
    email: user.email,
    id: user._id
  };

  // Generate JWT token
  console.log('in LOgin',process.env.SECRET)
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });

  res.status(200).send({ token, email: user.email, firstName: user.firstName, lastName: user.lastName, userType: user.userType, state: user.status, id: user.id });
});

module.exports = loginRouter;
