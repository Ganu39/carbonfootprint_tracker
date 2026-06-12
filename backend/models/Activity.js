const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  category: {
    type: String,
    enum: ['transport', 'food', 'energy', 'shopping'],
    required: [true, 'Category is required'],
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
  },
  co2Kg: {
    type: Number,
    required: [true, 'CO2 value is required'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

activitySchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Activity', activitySchema);
