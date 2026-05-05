const Message = require('../models/Message');
const User = require('../models/User');

// Get all users the current user can chat with (everyone except themselves)
exports.getContacts = async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await User.find({ _id: { $ne: userId } }).select(
      '_id fullName role profileImageUrl'
    );
    res.status(200).json({ contacts: users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId, otherId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherId },
        { senderId: otherId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    // Mark messages sent to userId as read
    await Message.updateMany(
      { senderId: otherId, receiverId: userId, read: false },
      { read: true }
    );

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, senderName, senderRole, receiverId, receiverName, receiverRole, text } = req.body;

    if (!senderId || !receiverId || !text?.trim()) {
      return res.status(400).json({ message: 'senderId, receiverId and text are required' });
    }

    const message = await Message.create({
      senderId,
      senderName,
      senderRole,
      receiverId,
      receiverName,
      receiverRole,
      text: text.trim(),
    });

    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get inbox summary — last message per conversation + unread count
exports.getInbox = async (req, res) => {
  try {
    const { userId } = req.params;

    // All messages involving this user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    // Build conversation map keyed by the other person's id
    const convMap = {};
    messages.forEach((msg) => {
      const otherId =
        msg.senderId.toString() === userId
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      if (!convMap[otherId]) {
        convMap[otherId] = {
          otherId,
          otherName:
            msg.senderId.toString() === userId ? msg.receiverName : msg.senderName,
          otherRole:
            msg.senderId.toString() === userId ? msg.receiverRole : msg.senderRole,
          lastMessage: msg.text,
          lastTime: msg.createdAt,
          unread: 0,
        };
      }
      // Count unread messages sent TO this user
      if (msg.receiverId.toString() === userId && !msg.read) {
        convMap[otherId].unread += 1;
      }
    });

    const conversations = Object.values(convMap).sort(
      (a, b) => new Date(b.lastTime) - new Date(a.lastTime)
    );

    res.status(200).json({ conversations });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get total unread count for a user
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.params.userId,
      read: false,
    });
    res.status(200).json({ unread: count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
