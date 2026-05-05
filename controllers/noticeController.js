const Notice = require('../models/Notice');

// Create a new notice (admin only)
exports.createNotice = async (req, res) => {
  try {
    const { title, details, postedBy, date, audience } = req.body;
    if (!title || !details || !postedBy || !date) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const notice = new Notice({
      title,
      details,
      postedBy,
      date,
      audience: audience || 'all',
    });
    await notice.save();
    res.status(201).json({ message: 'Notice created successfully', notice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get notices filtered by role
// - admin  → all notices
// - teacher → notices with audience 'all' or 'teachers'
// - student → notices with audience 'all' or 'students'
exports.getNoticesByRole = async (req, res) => {
  try {
    const { role } = req.query;

    let filter = {};
    if (role === 'teacher') {
      filter = { audience: { $in: ['all', 'teachers'] } };
    } else if (role === 'student') {
      filter = { audience: { $in: ['all', 'students'] } };
    }
    // admin gets everything (no filter)

    const notices = await Notice.find(filter).sort({ date: -1 });
    res.status(200).json({ notices });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all notices (kept for backward compat)
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.status(200).json({ notices });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a notice
exports.updateNotice = async (req, res) => {
  try {
    const { title, details, postedBy, date, audience } = req.body;
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, details, postedBy, date, audience },
      { new: true, runValidators: true }
    );
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.status(200).json({ message: 'Notice updated successfully', notice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a notice
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
