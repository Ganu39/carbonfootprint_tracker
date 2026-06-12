const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  weekOf: {
    type: Date,
    required: [true, 'Week start date is required'],
  },
  summary: {
    type: String,
  },
  tips: {
    type: [String],
  },
  worstCategory: {
    type: String,
  },
  projectedMonthlyKg: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Insight', insightSchema);
