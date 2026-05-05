const express = require('express');
const router = express.Router();
const {
  getAllFeeStructures,
  getFeeByClass,
  createFeeStructure,
  updateFeeStructure,
  deleteFeeStructure,
} = require('../controllers/feeStructureController');

router.get('/', getAllFeeStructures);
router.get('/by-class/:className', getFeeByClass);
router.post('/', createFeeStructure);
router.put('/:id', updateFeeStructure);
router.delete('/:id', deleteFeeStructure);

module.exports = router;
