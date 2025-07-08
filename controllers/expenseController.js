const Expense = require('../models/Expense');

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { id, expenseType, name, amount, status, phone, email, date } = req.body;
    if (!id || !expenseType || !name || !amount || !status || !phone || !email || !date) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const newExpense = new Expense({
      id,
      expenseType,
      name,
      amount,
      status,
      phone,
      email,
      date,
    });
    await newExpense.save();
    res.status(201).json({ message: 'Expense created successfully', expense: newExpense });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 