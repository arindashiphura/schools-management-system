const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  studentId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName:   { type: String },
  rollNo:        { type: String },
  class:         { type: String },
  section:       { type: String },
  amount:        { type: Number, required: true },
  feeType:       { type: String, default: 'Tuition' }, // Tuition, Exam, Library, etc.

  // Payment method: cash | bank | mobilemoney | studentid
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank', 'mobilemoney', 'studentid'],
    required: true,
  },

  // Cash-specific
  receiptNumber: { type: String },

  // Bank-specific
  bankName:      { type: String },
  accountNumber: { type: String },
  transactionRef:{ type: String },

  // Mobile Money-specific
  mobileProvider:{ type: String }, // MTN, Airtel, etc.
  mobileNumber:  { type: String },
  mobileTransactionId: { type: String },

  // Student ID-specific (auto-filled from student record)
  studentIdRef:  { type: String },

  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Due', 'Overdue'],
    default: 'Paid',
  },
  date:   { type: Date, required: true },
  notes:  { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);