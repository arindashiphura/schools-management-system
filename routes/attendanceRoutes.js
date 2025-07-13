const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// GET attendance for class/section/month/year
router.get('/', attendanceController.getAttendance);

// POST mark attendance
router.post('/', attendanceController.markAttendance);

// PUT update attendance by id
router.put('/:id', attendanceController.updateAttendance);

// DELETE attendance by id
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router; 