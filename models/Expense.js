const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  // Reference
  expenseId:    { type: String },
  expenseType:  { type: String, required: true },
  category:     { type: String, required: true }, // sub-category
  title:        { type: String, required: true }, // description/title
  amount:       { type: Number, required: true },
  currency:     { type: String, default: 'UGX' },

  // Payment details
  paymentMethod: { type: String, default: 'Cash' }, // Cash, Bank, Mobile Money, Cheque
  receiptNumber: { type: String },
  bankName:      { type: String },
  transactionRef:{ type: String },

  // Vendor / Payee
  vendorName:    { type: String },
  vendorPhone:   { type: String },
  vendorEmail:   { type: String },

  // Approval
  approvedBy:    { type: String },
  requestedBy:   { type: String },
  department:    { type: String }, // e.g. Science Dept, Admin, Sports

  // Status & dates
  status:        { type: String, enum: ['Paid', 'Pending', 'Approved', 'Rejected', 'Overdue'], default: 'Paid' },
  date:          { type: Date, required: true },
  dueDate:       { type: Date },

  // Notes
  notes:         { type: String },
  attachmentUrl: { type: String }, // receipt/invoice upload

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Expense', expenseSchema);