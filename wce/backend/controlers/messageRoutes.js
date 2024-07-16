const express = require('express');
const Messagerouter = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Add a new message (claim)
Messagerouter.post('/', async (req, res) => {
  const { subject, content, submittedBy, viewedBy } = req.body;

  try {
    const newMessage = new Message({
      subject,
      content,
      submittedBy,
      viewedBy,
    });

    const savedMessage = await newMessage.save();

    // Update the submitting user's hasNotification field
    await User.findByIdAndUpdate(submittedBy, { hasNotification: true });

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a specific user
Messagerouter.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({ submittedBy: userId })
  .populate('submittedBy', 'firstName lastName')
  .populate('viewedBy', 'firstName lastName');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all messages
Messagerouter.get('/', async (req, res) => {
  try {
    const messages = await Message.find().populate('submittedBy', 'firstName lastName');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark a message as viewed by an admin
Messagerouter.put('/:messageId', async (req, res) => {
  const { messageId } = req.params;
  const { adminId } = req.body;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.status = 'read'; // Update status to 'read'
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete a message
Messagerouter.delete('/:messageId', async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Update the submitting user's hasNotification field
    const userMessages = await Message.find({ submittedBy: message.submittedBy });
    const hasNotification = userMessages.length > 0;
    await User.findByIdAndUpdate(message.submittedBy, { hasNotification });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = Messagerouter;
