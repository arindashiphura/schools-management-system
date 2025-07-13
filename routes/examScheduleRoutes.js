const express = require('express');
const router = express.Router();
const {
  createExamSchedule,
  getAllExamSchedules,
  updateExamSchedule,
  deleteExamSchedule
} = require('../controllers/examScheduleController');

// Get all exams
router.get('/', getAllExamSchedules);

// Add a new exam
router.post('/', createExamSchedule);

// Update an exam
router.put('/:id', updateExamSchedule);

// Delete an exam
router.delete('/:id', deleteExamSchedule);

module.exports = router; 