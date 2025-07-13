const mongoose = require('mongoose');

const examGradeSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  gradePoint: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ExamGrade', examGradeSchema); 