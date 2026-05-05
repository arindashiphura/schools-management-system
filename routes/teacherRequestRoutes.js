const express = require('express');
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  getTeacherRequests,
  reviewRequest,
  deleteRequest,
} = require('../controllers/teacherRequestController');

router.post('/', createRequest);
router.get('/', getAllRequests);                          // ?status=pending|approved|rejected
router.get('/teacher/:teacherId', getTeacherRequests);
router.put('/:id/review', reviewRequest);
router.delete('/:id', deleteRequest);

module.exports = router;
