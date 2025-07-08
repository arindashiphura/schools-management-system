const Parent = require('../models/Parent');

// Create a new parent
exports.createParent = async (req, res) => {
  try {
    const { parentId, name, gender, occupation, address, mobile, email, photo } = req.body;
    if (!parentId || !name) {
      return res.status(400).json({ message: 'parentId and name are required.' });
    }
    const newParent = new Parent({ parentId, name, gender, occupation, address, mobile, email, photo });
    await newParent.save();
    res.status(201).json({ message: 'Parent created successfully', parent: newParent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all parents
exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.find().sort({ createdAt: -1 });
    res.status(200).json({ parents });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 