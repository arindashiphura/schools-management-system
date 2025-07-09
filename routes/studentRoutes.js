const express = require('express');
const { createStudent, getAllStudents, updateStudent, deleteStudent } = require('../controllers/studentController');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/add', upload.fields([
  { name: 'studentPhoto', maxCount: 1 },
  { name: 'parentsPhoto', maxCount: 1 }
]), createStudent);

router.get('/all', getAllStudents);

// Update student by ID
router.put('/:id', upload.fields([
  { name: 'studentPhoto', maxCount: 1 },
  { name: 'parentsPhoto', maxCount: 1 }
]), updateStudent);

// Delete student by ID
router.delete('/:id', deleteStudent);

module.exports = router; 