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

// Update a teacher by ID
exports.updateTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const updateData = { ...req.body };
    if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
    }
    // Remove undefined or empty string fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });
    const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, updateData, { new: true });
    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    res.status(200).json({ message: 'Teacher updated successfully', teacher: updatedTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a teacher by ID
exports.deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }
    res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 