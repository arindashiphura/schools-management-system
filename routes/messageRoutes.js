const express = require('express');
const router = express.Router();
const {
  getContacts,
  getConversation,
  sendMessage,
  getInbox,
  deleteMessage,
  getUnreadCount,
} = require('../controllers/messageController');

router.get('/contacts/:userId', getContacts);
router.get('/inbox/:userId', getInbox);
router.get('/unread/:userId', getUnreadCount);
router.get('/conversation/:userId/:otherId', getConversation);
router.post('/send', sendMessage);
router.delete('/:id', deleteMessage);

module.exports = router;
