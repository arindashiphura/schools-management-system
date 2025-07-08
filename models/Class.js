const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  classId: { type: String, required: true, unique: true },
  teacherName: { type: String, required: true },
  gender: { type: String },
  subject: { type: String },
  class: { type: String },
  section: { type: String },
  date: { type: String },
  timings: { type: String },
  photo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema); 