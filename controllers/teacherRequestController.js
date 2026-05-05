const TeacherRequest = require('../models/TeacherRequest');
const Teacher = require('../models/Teacher');

// Teacher submits a change request
exports.createRequest = async (req, res) => {
  try {
    const { teacherId, teacherName, teacherEmail, type, field, currentValue, requestedValue, reason } = req.body;
    if (!teacherId || !type || !requestedValue) {
      return res.status(400).json({ message: 'teacherId, type and requestedValue are required' });
    }
    const request = await TeacherRequest.create({
      teacherId, teacherName, teacherEmail, type, field, currentValue, requestedValue, reason,
    });
    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all requests (admin)
exports.getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await TeacherRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get requests for a specific teacher
exports.getTeacherRequests = async (req, res) => {
  try {
    const requests = await TeacherRequest.find({ teacherId: req.params.teacherId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin approves or rejects a request
exports.reviewRequest = async (req, res) => {
  try {
    const { status, adminNote, reviewedBy } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'status must be approved or rejected' });
    }

    const request = await TeacherRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    request.adminNote = adminNote || '';
    request.reviewedBy = reviewedBy || 'Admin';
    request.reviewedAt = new Date();
    await request.save();

    // If approved and it's a profile/class/subject update, apply the change to the Teacher record
    if (status === 'approved' && request.field) {
      const updateData = {};
      updateData[request.field] = request.requestedValue;
      await Teacher.findByIdAndUpdate(request.teacherId, updateData);
    }

    res.status(200).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a request
exports.deleteRequest = async (req, res) => {
  try {
    await TeacherRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
