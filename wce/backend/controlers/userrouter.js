const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Order = require('../models/Order');
require ('dotenv').config()
// const errorHandler = require('../middleware/errorHandler');

const usersRouter = express.Router();

// POST /api/users - Create a new user
usersRouter.post('/', async (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, location, password } = req.body;
  
    if (!phoneNumber  || !password) {
      return res.status(400).json({ error: 'First name, last name, email, phone number, location, and password are required' });
    }
  
    try {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
  
      const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        location,
        passwordHash
      });
  
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      next(error);
    }
  });

// GET /api/users - Retrieve all users
usersRouter.get('/', async (req, res, next) => {
    // console.log('User', req.user)
    if (!req.user || req.user === 'undefined' || req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  
    try {
      const users = await User.find({}).populate('orders').populate('orders');
      res.json(users);
    } catch (error) {
      next(error);
    }
  });
// GET /api/users/:id - Retrieve a specific user by ID
usersRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
    console.log(req.user)
  
    try {
      // Check if user is authenticated and has admin privileges or is accessing their own user data
      if (!req.user || (req.user.userType !== 'admin' && req.user.id !== id)) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
  
      const user = await User.findById(id).populate('orders');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      next(error);
    }
  });


// PUT /api/users/:id - Update a user by ID
usersRouter.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, location, userType, password, hasNotification, hasNotice, status } = req.body;
  
    try {
      // Check if user is authenticated and has admin privileges or is updating their own data
      if (!req.user || (req.user.userType !== 'admin' && req.user.id !== id)) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
      
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      console.log(req.user.userType)

      // Only allow updating userType if the authenticated user is an admin
      if (req.user.userType === 'admin') {
        if(userType && userType !== undefined && userType !== 'customer' && userType !== 'admin') {
            user.userType = 'customer'
        } else {
            user.userType = userType || user.userType;

        }
      }
  
      if (password) {
        const saltRounds = 10;
        user.passwordHash = await bcrypt.hash(password, saltRounds);
      }
  
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.location = location || user.location;
      user.hasNotification = hasNotification !== undefined ? hasNotification : user.hasNotification;
      user.hasNotice = hasNotice !== undefined ? hasNotice : user.hasNotice;
      user.status = status !== undefined ? status : user.status;
  
      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  });

// DELETE /api/users/:id - Delete a user by ID
usersRouter.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
  
    try {
      // Check if user is authenticated and has admin privileges
      if (!req.user || req.user.userType !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
  
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Optionally, delete all orders associated with the user
      await Order.deleteMany({ user: id });
  
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

// Error handling middleware
// usersRouter.use(errorHandler);

module.exports = usersRouter;
