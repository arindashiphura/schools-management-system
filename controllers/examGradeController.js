const ExamGrade = require('../models/ExamGrade');

// Get all exam grades
exports.getAllExamGrades = async (req, res) => {
  try {
    const grades = await ExamGrade.find().sort({ date: -1 });
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exam grades' });
  }
};

// Get a single exam grade by ID
exports.getExamGradeById = async (req, res) => {
  try {
    const grade = await ExamGrade.findById(req.params.id);
    if (!grade) return res.status(404).json({ error: 'Exam grade not found' });
    res.json(grade);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exam grade' });
  }
};

// Create a new exam grade
exports.createExamGrade = async (req, res) => {
  try {
    const { subject, grade, gradePoint, percentage, comment } = req.body;
    const newGrade = new ExamGrade({ subject, grade, gradePoint, percentage, comment });
    await newGrade.save();
    res.status(201).json(newGrade);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create exam grade' });
  }
};

// Update an exam grade
exports.updateExamGrade = async (req, res) => {
  try {
    const { subject, grade, gradePoint, percentage, comment } = req.body;
    const updated = await ExamGrade.findByIdAndUpdate(
      req.params.id,
      { subject, grade, gradePoint, percentage, comment },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Exam grade not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update exam grade' });
  }
};

// Delete an exam grade
exports.deleteExamGrade = async (req, res) => {
  try {
    const deleted = await ExamGrade.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Exam grade not found' });
    res.json({ message: 'Exam grade deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete exam grade' });
  }
}; 