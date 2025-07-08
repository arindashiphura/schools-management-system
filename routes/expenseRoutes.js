const express = require('express');
const router = express.Router();
const { createExpense, getAllExpenses } = require('../controllers/expenseController');

router.post('/', createExpense);
router.get('/', getAllExpenses);

module.exports = router; 