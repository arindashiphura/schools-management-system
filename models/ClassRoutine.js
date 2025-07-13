const mongoose = require('mongoose');

const ClassRoutineSchema = new mongoose.Schema({
  day: { type: String, required: true },
  class: { type: String, required: true },
  subjectName: { type: String, required: true },
  section: { type: String, required: true },
  teacher: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  subjectType: { type: String },
  subjectCode: { type: String }
});

module.exports = mongoose.model('ClassRoutine', ClassRoutineSchema); 