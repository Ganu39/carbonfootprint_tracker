const express = require('express');
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');
const { calculateCO2 } = require('../utils/emissionFactors');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/activities - Get all activities for the authenticated user
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;

    const query = Activity.find({ userId: req.user._id }).sort({ date: -1 });

    if (limit > 0) {
      query.limit(limit);
    }

    const activities = await query;

    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error.message);
    res.status(500).json({ error: 'Failed to fetch activities.' });
  }
});

// POST /api/activities - Create a new activity
router.post('/', async (req, res) => {
  try {
    const { category, type, quantity, unit, date } = req.body;

    // Validation
    if (!category || !type || quantity === undefined || !unit) {
      return res.status(400).json({ error: 'Category, type, quantity, and unit are required.' });
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ error: 'Quantity must be a non-negative number.' });
    }

    // Calculate CO2
    let co2Kg;
    try {
      co2Kg = calculateCO2(category, type, quantity);
    } catch (calcError) {
      return res.status(400).json({ error: calcError.message });
    }

    const activity = await Activity.create({
      userId: req.user._id,
      category,
      type,
      quantity,
      unit,
      co2Kg,
      date: date || Date.now(),
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error('Create activity error:', error.message);
    res.status(500).json({ error: 'Failed to create activity.' });
  }
});

// DELETE /api/activities/:id - Delete an activity
router.delete('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found.' });
    }

    // Check ownership
    if (activity.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to delete this activity.' });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.json({ message: 'Activity deleted successfully.' });
  } catch (error) {
    console.error('Delete activity error:', error.message);
    res.status(500).json({ error: 'Failed to delete activity.' });
  }
});

module.exports = router;
