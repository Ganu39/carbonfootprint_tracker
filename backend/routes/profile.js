const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/profile - Get user profile
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// PUT /api/profile - Update user profile
router.put('/', async (req, res) => {
  try {
    const { name, monthlyGoalKg, dietType, carType } = req.body;

    const updateFields = {};

    if (name !== undefined) {
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Name must be a non-empty string.' });
      }
      updateFields.name = name;
    }

    if (monthlyGoalKg !== undefined) {
      if (typeof monthlyGoalKg !== 'number' || monthlyGoalKg <= 0) {
        return res.status(400).json({ error: 'Monthly goal must be a positive number.' });
      }
      updateFields.monthlyGoalKg = monthlyGoalKg;
    }

    if (dietType !== undefined) {
      updateFields.dietType = dietType;
    }

    if (carType !== undefined) {
      updateFields.carType = carType;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

module.exports = router;
