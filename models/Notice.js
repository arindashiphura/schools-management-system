const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  postedBy: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  // 'all' = everyone, 'teachers' = teachers only, 'students' = students only
  audience: {
    type: String,
    enum: ['all', 'teachers', 'students'],
    default: 'all'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notice', noticeSchema);