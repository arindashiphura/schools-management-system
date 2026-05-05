const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createTeacher, getAllTeachers, updateTeacher, deleteTeacher,
  getRegisteredTeacherUsers,
} = require('../controllers/teacherController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: 'photo',         maxCount: 1 },
  { name: 'passportPhoto', maxCount: 1 },
]);

router.get('/registered-users', getRegisteredTeacherUsers); // must be before /:id
router.post('/',    uploadFields, createTeacher);
router.get('/',     getAllTeachers);
router.put('/:id',  uploadFields, updateTeacher);
router.delete('/:id', deleteTeacher);

module.exports = router;
