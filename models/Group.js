const mongoose = require('mongoose');

const GroupMessageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: { type: String, required: true },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        role: { type: String },
      },
    ],
    messages: [GroupMessageSchema],
    // avatar color for the group
    color: { type: String, default: 'bg-indigo-500' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Group', GroupSchema);
