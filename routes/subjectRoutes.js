const express = require('express');
const router = express.Router();
const {
  createSubject, getAllSubjects, updateSubject, deleteSubject,
  seedSubjects, getSubjectsByClass, assignTeacher, getSubjectStudents,
} = require('../controllers/subjectController');

router.post('/seed', seedSubjects);                    // seed Uganda subjects
router.post('/', createSubject);
router.get('/', getAllSubjects);                        // ?level=O-Level&department=Sciences&class=S1
router.get('/by-class/:className', getSubjectsByClass);
router.get('/:id/students', getSubjectStudents);
router.put('/:id/assign-teacher', assignTeacher);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router;
