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

// Update an expense by ID
exports.updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const updateData = { ...req.body };
    // Remove undefined or empty string fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });
    const updatedExpense = await Expense.findByIdAndUpdate(expenseId, updateData, { new: true });
    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found.' });
    }
    res.status(200).json({ message: 'Expense updated successfully', expense: updatedExpense });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an expense by ID
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found.' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 