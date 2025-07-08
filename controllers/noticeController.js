const Notice = require('../models/Notice');

// Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const { title, details, postedBy, date } = req.body;
    if (!title || !details || !postedBy || !date) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const notice = new Notice({ title, details, postedBy, date });
    await notice.save();
    res.status(201).json({ message: 'Notice created successfully', notice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all notices (sorted by date desc)
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.status(200).json({ notices });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 