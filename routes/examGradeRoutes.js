const express = require('express');
const router = express.Router();
const examGradeController = require('../controllers/examGradeController');

// Get all exam grades
router.get('/', examGradeController.getAllExamGrades);

// Get a single exam grade by ID
router.get('/:id', examGradeController.getExamGradeById);

// Create a new exam grade
router.post('/', examGradeController.createExamGrade);

// Update an exam grade
router.put('/:id', examGradeController.updateExamGrade);

// Delete an exam grade
router.delete('/:id', examGradeController.deleteExamGrade);

module.exports = router; 