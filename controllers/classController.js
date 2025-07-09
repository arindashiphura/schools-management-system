const Class = require('../models/Class');

// Create a new class
exports.createClass = async (req, res) => {
  try {
    const { classId, teacherName, gender, subject, class: className, section, date, timings, photo } = req.body;
    if (!classId || !teacherName) {
      return res.status(400).json({ message: 'classId and teacherName are required.' });
    }
    const newClass = new Class({ classId, teacherName, gender, subject, class: className, section, date, timings, photo });
    await newClass.save();
    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.status(200).json({ classes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a class by ID
exports.updateClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const updateData = { ...req.body };
    // Remove undefined or empty string fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });
    const updatedClass = await Class.findByIdAndUpdate(classId, updateData, { new: true });
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found.' });
    }
    res.status(200).json({ message: 'Class updated successfully', class: updatedClass });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a class by ID
exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const deletedClass = await Class.findByIdAndDelete(classId);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found.' });
    }
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 