const express = require('express');
const router = express.Router();
const { createParent, getAllParents, updateParent, deleteParent } = require('../controllers/parentController');
const multer = require('multer');
const path = require('path');

// Multer setup for photo upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/', createParent);
router.get('/', getAllParents);
router.put('/:id', upload.single('photo'), updateParent);
router.delete('/:id', deleteParent);

module.exports = router; 