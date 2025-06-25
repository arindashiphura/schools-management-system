const express = require('express');
const { createStudent, getAllStudents } = require('../controllers/studentController');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/add', upload.fields([
  { name: 'studentPhoto', maxCount: 1 },
  { name: 'parentsPhoto', maxCount: 1 }
]), createStudent);

router.get('/all', getAllStudents);

// You can add more routes here later for getting all students, updating, deleting, etc.
// router.get('/all', studentController.getAllStudents);

module.exports = router; 