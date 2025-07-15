const express = require('express');
const { createPayment, getAllPayments, updatePayment, deletePayment } = require('../controllers/paymentController');
const router = express.Router();
router.post('/', createPayment);
router.get('/', getAllPayments);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);
module.exports = router; 