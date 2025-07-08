const express = require('express');
const router = express.Router();
const { createParent, getAllParents } = require('../controllers/parentController');

router.post('/', createParent);
router.get('/', getAllParents);

module.exports = router; 