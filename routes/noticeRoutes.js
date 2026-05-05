const express = require('express');
const router = express.Router();
const {
  createNotice,
  getAllNotices,
  getNoticesByRole,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');

router.post('/', createNotice);
router.get('/', getAllNotices);
router.get('/by-role', getNoticesByRole);
router.put('/:id', updateNotice);
router.delete('/:id', deleteNotice);

module.exports = router;
