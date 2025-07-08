const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectName: { type: String, required: true },
  subjectType: { type: String, required: true },
  class: { type: String, required: true },
  subjectCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subject', subjectSchema); 