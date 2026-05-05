const Group = require('../models/Group');
const User = require('../models/User');

const GROUP_COLORS = [
  'bg-indigo-500', 'bg-pink-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-600', 'bg-rose-500',
];

// Create a group
exports.createGroup = async (req, res) => {
  try {
    const { name, description, createdBy, createdByName, memberIds } = req.body;
    if (!name || !createdBy) {
      return res.status(400).json({ message: 'name and createdBy are required' });
    }

    // Fetch member details
    const users = await User.find({ _id: { $in: memberIds || [] } }).select('_id fullName role');
    const members = users.map(u => ({ userId: u._id, name: u.fullName, role: u.role }));

    // Always include creator
    const creatorUser = await User.findById(createdBy).select('_id fullName role');
    const alreadyIn = members.some(m => m.userId.toString() === createdBy);
    if (!alreadyIn && creatorUser) {
      members.unshift({ userId: creatorUser._id, name: creatorUser.fullName, role: creatorUser.role });
    }

    const color = GROUP_COLORS[Math.floor(Math.random() * GROUP_COLORS.length)];

    const group = await Group.create({
      name,
      description,
      createdBy,
      createdByName,
      members,
      color,
    });

    res.status(201).json({ group });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all groups a user belongs to
exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await Group.find({ 'members.userId': userId })
      .select('name description color members createdByName messages updatedAt')
      .sort({ updatedAt: -1 });

    // Shape response — include last message + unread count
    const shaped = groups.map(g => {
      const msgs = g.messages || [];
      const lastMsg = msgs[msgs.length - 1] || null;
      const unread = msgs.filter(
        m => !m.readBy.map(id => id.toString()).includes(userId)
          && m.senderId.toString() !== userId
      ).length;

      return {
        _id: g._id,
        name: g.name,
        description: g.description,
        color: g.color,
        memberCount: g.members.length,
        createdByName: g.createdByName,
        lastMessage: lastMsg ? lastMsg.text : null,
        lastTime: lastMsg ? lastMsg.createdAt : g.createdAt,
        unread,
      };
    });

    res.status(200).json({ groups: shaped });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get group messages (marks all as read for this user)
exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // Mark all unread messages as read by this user
    let updated = false;
    group.messages.forEach(msg => {
      if (!msg.readBy.map(id => id.toString()).includes(userId)) {
        msg.readBy.push(userId);
        updated = true;
      }
    });
    if (updated) await group.save();

    res.status(200).json({
      group: {
        _id: group._id,
        name: group.name,
        description: group.description,
        color: group.color,
        members: group.members,
        createdByName: group.createdByName,
      },
      messages: group.messages,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Send a message to a group
exports.sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { senderId, senderName, senderRole, text } = req.body;

    if (!text?.trim()) return res.status(400).json({ message: 'text is required' });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const newMsg = {
      senderId,
      senderName,
      senderRole,
      text: text.trim(),
      readBy: [senderId],
    };

    group.messages.push(newMsg);
    await group.save();

    const saved = group.messages[group.messages.length - 1];
    res.status(201).json({ message: saved });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a group message
exports.deleteGroupMessage = async (req, res) => {
  try {
    const { groupId, messageId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.messages = group.messages.filter(m => m._id.toString() !== messageId);
    await group.save();
    res.status(200).json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add members to a group
exports.addMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberIds } = req.body;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const users = await User.find({ _id: { $in: memberIds } }).select('_id fullName role');
    users.forEach(u => {
      const exists = group.members.some(m => m.userId.toString() === u._id.toString());
      if (!exists) group.members.push({ userId: u._id, name: u.fullName, role: u.role });
    });

    await group.save();
    res.status(200).json({ group });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete a group (creator only)
exports.deleteGroup = async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.groupId);
    res.status(200).json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
