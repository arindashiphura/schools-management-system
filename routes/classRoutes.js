const express = require('express');
const router = express.Router();
const { createClass, getAllClasses, updateClass, deleteClass } = require('../controllers/classController');

router.post('/', createClass);
router.get('/', getAllClasses);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

module.exports = router; 