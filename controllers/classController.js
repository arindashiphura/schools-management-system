const Class = require('../models/Class');
const Teacher = require('../models/Teacher');

// Create a new class
exports.createClass = async (req, res) => {
  try {
    const { className, stream, level, teacherName, teacherId, subjects, day, timings, date, room, gender, photo } = req.body;
    if (!className || !stream) {
      return res.status(400).json({ message: 'className and stream are required.' });
    }
    // Auto-generate classId e.g. S1A, S2B
    const classId = `${className}${stream}`.toUpperCase();
    // Check if already exists
    const existing = await Class.findOne({ classId });
    if (existing) {
      return res.status(400).json({ message: `Class ${classId} already exists.` });
    }
    const newClass = new Class({ classId, className, stream, level, teacherName, teacherId, subjects, day, timings, date, room, gender, photo });
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