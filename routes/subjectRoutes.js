const express = require('express');
const router = express.Router();
const { createSubject, getAllSubjects, updateSubject, deleteSubject } = require('../controllers/subjectController');

router.post('/', createSubject);
router.get('/', getAllSubjects);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router; 