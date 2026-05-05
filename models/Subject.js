const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectName:  { type: String, required: true, trim: true },
  subjectCode:  { type: String, required: true, trim: true },
  subjectType:  {
    type: String,
    enum: ['Compulsory', 'Elective', 'Subsidiary', 'Practical'],
    default: 'Elective',
  },
  level: {
    type: String,
    enum: ['O-Level', 'A-Level', 'Both'],
    default: 'O-Level',
  },
  classes:      [{ type: String }],   // e.g. ['S1','S2','S3','S4']
  department:   { type: String },     // e.g. Sciences, Arts, Languages
  description:  { type: String },
  // Assigned teacher
  teacherId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  teacherName:  { type: String },
  createdAt:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subject', subjectSchema);