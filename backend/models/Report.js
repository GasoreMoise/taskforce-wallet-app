const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Report name is required'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['expense', 'income', 'budget', 'summary']
  },
  dateRange: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  filters: {
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }],
    accounts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account'
    }]
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

reportSchema.index({ user: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema); 