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