const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createTeacher, getAllTeachers, updateTeacher, deleteTeacher } = require('../controllers/teacherController');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Accept both profile photo and passport photo
const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'passportPhoto', maxCount: 1 },
]);

router.post('/', uploadFields, createTeacher);
router.get('/', getAllTeachers);
router.put('/:id', uploadFields, updateTeacher);
router.delete('/:id', deleteTeacher);

module.exports = router; 