const express = require('express');
const Noticerouter = express.Router();
const Notice = require('../models/Notice');
const User = require('../models/User');

// Add a new notice
Noticerouter.post('/', async (req, res) => {
  const { title, content, isGlobal, targetUser, publishedBy } = req.body;

  try {
    const newNotice = new Notice({
      title,
      content,
      isGlobal,
      targetUser: isGlobal ? null : targetUser,
      publishedBy
    });

    const savedNotice = await newNotice.save();

    // If the notice is user-specific, update the target user's hasNotice field
    if (!isGlobal) {
      await User.findByIdAndUpdate(targetUser, { hasNotice: true });
    }

    res.status(201).json(savedNotice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notices for a specific user
Noticerouter.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const notices = await Notice.find({ 
      $or: [
        { isGlobal: true },
        { targetUser: userId }
      ]
    }).populate('publishedBy', 'firstName lastName');

    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all notices
Noticerouter.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().populate('targetUser', 'userId email firstName lastName');
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark a notice as viewed by an admin
Noticerouter.put('/viewed/:noticeId', async (req, res) => {
  const { noticeId } = req.params;
  const { adminId } = req.body;

  try {
    const notice = await Notice.findById(noticeId);

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    notice.viewedBy.push(adminId);
    await notice.save();

    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a notice
Noticerouter.delete('/:noticeId', async (req, res) => {
  const { noticeId } = req.params;

  try {
    const notice = await Notice.findByIdAndDelete(noticeId);

    if (!notice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    // If the notice was user-specific, update the target user's hasNotice field
    if (!notice.isGlobal && notice.targetUser) {
      const userNotices = await Notice.find({ targetUser: notice.targetUser });
      const hasNotice = userNotices.length > 0;
      await User.findByIdAndUpdate(notice.targetUser, { hasNotice });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = Noticerouter;
