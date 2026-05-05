const express = require('express');
const router = express.Router();
const {
  createGroup,
  getUserGroups,
  getGroupMessages,
  sendGroupMessage,
  deleteGroupMessage,
  addMembers,
  deleteGroup,
} = require('../controllers/groupController');

router.post('/', createGroup);
router.get('/user/:userId', getUserGroups);
router.get('/:groupId/messages/:userId', getGroupMessages);
router.post('/:groupId/messages', sendGroupMessage);
router.delete('/:groupId/messages/:messageId', deleteGroupMessage);
router.post('/:groupId/members', addMembers);
router.delete('/:groupId', deleteGroup);

module.exports = router;
