const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  expenseType: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Expense', expenseSchema); 