const express = require('express');
const router = express.Router();
const { createNotice, getAllNotices } = require('../controllers/noticeController');

// Create a new notice
router.post('/', createNotice);

// Get all notices
router.get('/', getAllNotices);

module.exports = router; 