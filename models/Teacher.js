const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String },
  subject: { type: String },
  class: { type: String },
  section: { type: String },
  address: { type: String },
  dob: { type: String },
  mobile: { type: String },
  email: { type: String },
  photo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema); 