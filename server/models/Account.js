const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Account name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Account type is required'],
    enum: ['bank', 'mobile_money', 'cash', 'credit_card', 'investment'],
  },
  balance: {
    type: Number,
    required: [true, 'Account balance is required'],
    default: 0
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'USD'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
accountSchema.index({ user: 1, type: 1 });

// Virtual populate for transactions
accountSchema.virtual('transactions', {
  ref: 'Transaction',
  foreignField: 'account',
  localField: '_id'
});

module.exports = mongoose.model('Account', accountSchema); 