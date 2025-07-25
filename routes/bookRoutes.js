const express = require('express');
const router = express.Router();
const { createBook, getAllBooks, updateBook, deleteBook } = require('../controllers/bookController');

router.post('/', createBook);
router.get('/', getAllBooks);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router; 