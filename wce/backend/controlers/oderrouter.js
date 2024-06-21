const express = require('express');
const Order = require('../models/Order');
const Service = require('../models/service');
const mongoose = require('mongoose');

const Oderrouter = express.Router();

// POST /api/orders - Create a new order
Oderrouter.post('/', async (req, res, next) => {
  const { serviceId, quantity, notes } = req.body;
  console.log(req.user)

  try {
    // Check if serviceId is a valid ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ error: 'Invalid serviceId format' });
    }

    // Find the service by its ObjectId
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Check if service is sold in units
    if (service.soldInUnits && (!quantity || quantity < 1)) {
      return res.status(400).json({ error: 'Quantity is required for this service' });
    }

    // If quantity is not provided or not valid, default to 1
    const validQuantity = quantity && quantity >= 1 ? quantity : 1;

    // Calculate totalPrice based on service price and quantity
    const totalPrice = service.price * validQuantity;

    // Create a new order object
    const newOrder = new Order({
      service: serviceId,
      quantity: validQuantity,
      totalPrice,
      notes, // Include notes in the new order
      status: 'processing', // Default status to 'processing'
      user: req.user.id // Associate order with the authenticated user
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();
    console.log('savedOrder', savedOrder)
    req.user.orders = req.user.orders.concat(savedOrder._id);
    res.status(201).json(savedOrder);
    await req.user.save()
  } catch (error) {
    next(error);
  }
});
// GET /api/orders - Retrieve all orders
Oderrouter.get('/', async (req, res, next) => {
  try {
    // Ensure req.user exists and is an admin
    if (!req.user || req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const orders = await Order.find().populate('user');
    res.json(orders);
  } catch (error) {
    next(error);
  }
});


// GET /api/orders/:id - Retrieve a specific order by ID
Oderrouter.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!req.user ) {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }

  try {
    const order = await Order.findById(id).populate('service').populate('user'); // Populate 'user' to access user details
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the authenticated user is an admin or the creator of the order
    if (req.user && req.user.userType === 'admin' || order.user._id.toString() === req.user._id.toString()) {
      res.json(order);
    } else {
      return res.status(403).json({ error: 'Access denied. Admins or order creator only.' });
    }
  } catch (error) {
    next(error);
  }
})

// PUT /api/orders/:id - Update an order by ID
Oderrouter.put('/:id',  async (req, res, next) => {
  const { id } = req.params;
  const { quantity, notes, status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the authenticated user is an admin
    if (req.user && req.user.userType === 'admin') {
      // Update order properties
      order.quantity = quantity || order.quantity;
      order.notes = notes || order.notes;
      order.status = status || order.status; // Update status if provided

      // Calculate updated totalPrice if quantity changes
      if (quantity) {
        const service = await Service.findById(order.service);
        if (!service) {
          return res.status(404).json({ error: 'Service not found' });
        }
        order.totalPrice = service.price * order.quantity;
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  } catch (error) {
    next(error);
  }
});

// Delete an order by ID - Accessible only to admin users
Oderrouter.delete('/:id',  async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the authenticated user is an admin
    if (req.user && req.user.userType === 'admin') {
      const deletedOrder = await Order.findByIdAndDelete(id);
      if (!deletedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.status(204).end();
    } else {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = Oderrouter;
