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

// Update a parent by ID
exports.updateParent = async (req, res) => {
  try {
    const parentId = req.params.id;
    const updateData = { ...req.body };
    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }
    // Remove undefined or empty string fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });
    const updatedParent = await Parent.findByIdAndUpdate(parentId, updateData, { new: true });
    if (!updatedParent) {
      return res.status(404).json({ message: 'Parent not found.' });
    }
    res.status(200).json({ message: 'Parent updated successfully', parent: updatedParent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a parent by ID
exports.deleteParent = async (req, res) => {
  try {
    const parentId = req.params.id;
    const deletedParent = await Parent.findByIdAndDelete(parentId);
    if (!deletedParent) {
      return res.status(404).json({ message: 'Parent not found.' });
    }
    res.status(200).json({ message: 'Parent deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 