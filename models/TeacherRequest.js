const mongoose = require('mongoose');

const TeacherRequestSchema = new mongoose.Schema(
  {
    teacherId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    teacherName:  { type: String, required: true },
    teacherEmail: { type: String },
    type: {
      type: String,
      enum: [
        // Leave requests
        'sick_leave',
        'maternity_leave',
        'paternity_leave',
        'emergency_leave',
        'annual_leave',
        'unpaid_leave',
        // School programme adjustments
        'update_class',
        'update_subject',
        'update_schedule',
        'update_timetable',
        'exam_proposal',
        'assignment_proposal',
        'extra_class',
        // Profile
        'update_profile',
        'other',
      ],
      required: true,
    },
    // Leave-specific fields
    leaveStartDate: { type: Date },
    leaveEndDate:   { type: Date },
    leaveDays:      { type: Number },
    leaveDocument:  { type: String }, // uploaded doc path if any
    field:        { type: String },          // which field they want changed
    currentValue: { type: String },          // current value
    requestedValue: { type: String },        // what they want it changed to
    reason:       { type: String },          // why they need the change
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNote:    { type: String },          // admin's response note
    reviewedBy:   { type: String },
    reviewedAt:   { type: Date },
    // Exam/Assignment proposal details
    proposalDetails: {
      examName:    { type: String },
      subject:     { type: String },
      class:       { type: String },
      section:     { type: String },
      date:        { type: String },
      time:        { type: String },
      duration:    { type: String },
      description: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TeacherRequest', TeacherRequestSchema);
