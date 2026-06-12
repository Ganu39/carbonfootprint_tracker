const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
  },
  monthlyGoalKg: {
    type: Number,
    default: 100,
  },
  dietType: {
    type: String,
    default: 'mixed',
  },
  carType: {
    type: String,
    default: 'petrol',
  },
  streakDays: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
