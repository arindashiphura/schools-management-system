const Teacher = require('../models/Teacher');

// Create a new teacher (with photo upload)
exports.createTeacher = async (req, res) => {
  try {
    const { teacherId, name, gender, subject, class: className, section, address, dob, mobile, email } = req.body;
    let photoPath = '';
    if (req.file) {
      photoPath = `/uploads/${req.file.filename}`;
    }
    if (!teacherId || !name) {
      return res.status(400).json({ message: 'teacherId and name are required.' });
    }
    const newTeacher = new Teacher({
      teacherId,
      name,
      gender,
      subject,
      class: className,
      section,
      address,
      dob,
      mobile,
      email,
      photo: photoPath,
    });
    await newTeacher.save();
    res.status(201).json({ message: 'Teacher created successfully', teacher: newTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    res.status(200).json({ teachers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 