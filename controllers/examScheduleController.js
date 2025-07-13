const ExamSchedule = require('../models/ExamSchedule');

// Create a new exam schedule
exports.createExamSchedule = async (req, res) => {
  try {
    const { day, class: className, subjectName, section, teacher, time, date, subjectType, examName } = req.body;
    if (!day || !className || !subjectName || !section || !teacher || !time || !date || !examName) {
      return res.status(400).json({ message: 'All required fields are needed.' });
    }
    const newExamSchedule = new ExamSchedule({
      day,
      class: className,
      subjectName,
      section,
      teacher,
      time,
      date,
      subjectType,
      examName
    });
    await newExamSchedule.save();
    res.status(201).json({ message: 'Exam schedule created successfully', examSchedule: newExamSchedule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all exam schedules
exports.getAllExamSchedules = async (req, res) => {
  try {
    const examSchedules = await ExamSchedule.find().sort({ createdAt: -1 });
    res.status(200).json(examSchedules);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an exam schedule by ID
exports.updateExamSchedule = async (req, res) => {
  try {
    const examScheduleId = req.params.id;
    const updateData = { ...req.body };
    // Remove undefined or empty string fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });
    const updatedExamSchedule = await ExamSchedule.findByIdAndUpdate(examScheduleId, updateData, { new: true });
    if (!updatedExamSchedule) {
      return res.status(404).json({ message: 'Exam schedule not found.' });
    }
    res.status(200).json({ message: 'Exam schedule updated successfully', examSchedule: updatedExamSchedule });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an exam schedule by ID
exports.deleteExamSchedule = async (req, res) => {
  try {
    const examScheduleId = req.params.id;
    const deletedExamSchedule = await ExamSchedule.findByIdAndDelete(examScheduleId);
    if (!deletedExamSchedule) {
      return res.status(404).json({ message: 'Exam schedule not found.' });
    }
    res.status(200).json({ message: 'Exam schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 