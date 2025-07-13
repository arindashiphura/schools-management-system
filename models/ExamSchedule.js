const mongoose = require('mongoose');

const ExamScheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  class: { type: String, required: true },
  subjectName: { type: String, required: true },
  section: { type: String, required: true },
  teacher: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  subjectType: { type: String },
  examName: { type: String, required: true }
});

module.exports = mongoose.model('ExamSchedule', ExamScheduleSchema); 