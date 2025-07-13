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

// Update a subject by ID
exports.updateSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;
    const updateData = { ...req.body };
    // Remove undefined or empty string fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });
    const updatedSubject = await Subject.findByIdAndUpdate(subjectId, updateData, { new: true });
    if (!updatedSubject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    res.status(200).json({ message: 'Subject updated successfully', subject: updatedSubject });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a subject by ID
exports.deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;
    const deletedSubject = await Subject.findByIdAndDelete(subjectId);
    if (!deletedSubject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }
    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 