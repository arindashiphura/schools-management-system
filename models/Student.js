const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
  },
  dob: {
    type: Date,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    unique: true,
    trim: true
  },
  admissionNo: {
    type: String,
    trim: true
  },
  religion: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  studentPhoto: {
    type: String, // Store path to the uploaded photo
    trim: true,
  },
  fatherName: {
    type: String,
    trim: true
  },
  motherName: {
    type: String,
    trim: true
  },
  fatherOccupation: {
    type: String,
    trim: true
  },
  motherOccupation: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  nationality: {
    type: String,
    trim: true
  },
  presentAddress: {
    type: String,
    trim: true
  },
  permanentAddress: {
    type: String,
    trim: true
  },
  parentsPhoto: {
    type: String, // Store path to the uploaded photo
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Student', StudentSchema); 