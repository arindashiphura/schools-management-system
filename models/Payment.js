const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  rollNo: String,
  amount: Number,
  paymentMethod: String,
  status: String,
  date: Date,
}, { timestamps: true });
module.exports = mongoose.model('Payment', PaymentSchema); 