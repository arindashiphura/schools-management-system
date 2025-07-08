const express = require('express');
const router = express.Router();
const { createSubject, getAllSubjects } = require('../controllers/subjectController');

router.post('/', createSubject);
router.get('/', getAllSubjects);

module.exports = router; 