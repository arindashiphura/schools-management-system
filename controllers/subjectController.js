const Subject = require('../models/Subject');

// Create a new subject
exports.createSubject = async (req, res) => {
  try {
    const { subjectName, subjectType, class: className, subjectCode } = req.body;
    if (!subjectName || !subjectType || !className || !subjectCode) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const newSubject = new Subject({
      subjectName,
      subjectType,
      class: className,
      subjectCode,
    });
    await newSubject.save();
    res.status(201).json({ message: 'Subject created successfully', subject: newSubject });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.status(200).json({ subjects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 