const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/stats/weekly - Aggregate activities for past 8 weeks
router.get('/weekly', async (req, res) => {
  try {
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const stats = await Activity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          date: { $gte: eightWeeksAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: '$date' },
            week: { $isoWeek: '$date' },
          },
          totalCO2: { $sum: '$co2Kg' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.week': 1 },
      },
      {
        $project: {
          _id: 0,
          week: {
            $concat: [
              { $toString: '$_id.year' },
              '-W',
              { $toString: '$_id.week' },
            ],
          },
          totalCO2: { $round: ['$totalCO2', 2] },
          count: 1,
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Weekly stats error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weekly stats.' });
  }
});

// GET /api/stats/monthly - Aggregate activities for past 12 months
router.get('/monthly', async (req, res) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const stats = await Activity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          date: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          totalCO2: { $sum: '$co2Kg' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' },
                },
              },
            ],
          },
          totalCO2: { $round: ['$totalCO2', 2] },
          count: 1,
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Monthly stats error:', error.message);
    res.status(500).json({ error: 'Failed to fetch monthly stats.' });
  }
});

// GET /api/stats/categories - Aggregate activities for current month by category
router.get('/categories', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = await Activity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          totalCO2: { $sum: '$co2Kg' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalCO2: { $round: ['$totalCO2', 2] },
          count: 1,
        },
      },
      {
        $sort: { totalCO2: -1 },
      },
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Category stats error:', error.message);
    res.status(500).json({ error: 'Failed to fetch category stats.' });
  }
});

module.exports = router;
