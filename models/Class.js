const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  classId:     { type: String, required: true, unique: true },
  // e.g. S1A, S2B, S3A
  className:   { type: String, required: true }, // S1, S2, S3, S4, S5, S6
  stream:      { type: String, required: true }, // A, B, C, D (stream/section)
  level:       { type: String, enum: ['O-Level', 'A-Level'], default: 'O-Level' },
  // Class teacher
  teacherName: { type: String },
  teacherId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  gender:      { type: String },
  // Subjects taught in this class (references)
  subjects:    [{ type: String }], // subject names or codes
  // Timetable
  day:         { type: String }, // Monday, Tuesday...
  timings:     { type: String }, // e.g. 08:00 am - 09:00 am
  date:        { type: String },
  // Room
  room:        { type: String },
  photo:       { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);