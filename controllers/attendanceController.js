const Attendance = require('../models/Attendance');

// Fetch attendance for a class/section/month/year
dateToMonthYear = (date) => {
  const d = new Date(date);
  return { month: d.getMonth() + 1, year: d.getFullYear() };
};

exports.getAttendance = async (req, res) => {
  try {
    const { class: className, section, month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    const query = {
      class: className,
      section,
      date: { $gte: startDate, $lte: endDate },
    };
    const records = await Attendance.find(query).populate('student');
    res.json({ attendance: records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark attendance for a student on a date
exports.markAttendance = async (req, res) => {
  try {
    const { student, class: className, section, date, status } = req.body;
    let record = await Attendance.findOne({ student, class: className, section, date });
    if (record) {
      record.status = status;
      await record.save();
    } else {
      record = await Attendance.create({ student, class: className, section, date, status });
    }
    res.json({ attendance: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update attendance (by id)
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const record = await Attendance.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ attendance: record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Optional) Delete attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    await Attendance.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 