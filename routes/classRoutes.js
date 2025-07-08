const express = require('express');
const router = express.Router();
const { createClass, getAllClasses } = require('../controllers/classController');

router.post('/', createClass);
router.get('/', getAllClasses);

module.exports = router; 