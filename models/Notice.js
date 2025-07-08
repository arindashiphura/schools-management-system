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
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Notice', noticeSchema); 