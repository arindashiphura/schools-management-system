const Student = require('../models/Student');
const Parent = require('../models/Parent');
const path = require('path');
const fs = require('fs');

exports.createStudent = async (req, res) => {
  try {
    const { firstName, lastName, gender, dob, class: studentClass, section, rollNo, admissionNo, religion, email, fatherName, motherName, fatherOccupation, motherOccupation, phoneNumber, nationality, presentAddress, permanentAddress } = req.body;

    // Check if rollNo or admissionNo or email already exists
    const existingStudent = await Student.findOne({ $or: [{ rollNo }, { admissionNo }, { email }] });
    if (existingStudent) {
      return res.status(400).json({ success: false, message: 'Student with this Roll No., Admission No., or Email already exists.' });
    }

    let studentPhotoPath = null;
    let parentsPhotoPath = null;

    if (req.files && req.files.studentPhoto) {
      studentPhotoPath = `/uploads/${req.files.studentPhoto[0].filename}`;
    }
    if (req.files && req.files.parentsPhoto) {
      parentsPhotoPath = `/uploads/${req.files.parentsPhoto[0].filename}`;
    }

    const newStudent = new Student({
      firstName,
      lastName,
      gender,
      dob,
      class: studentClass,
      section,
      rollNo,
      admissionNo,
      religion,
      email,
      studentPhoto: studentPhotoPath,
      fatherName,
      motherName,
      fatherOccupation,
      motherOccupation,
      phoneNumber,
      nationality,
      presentAddress,
      permanentAddress,
      parentsPhoto: parentsPhotoPath,
    });

    await newStudent.save();

    // Save father as parent
    if (fatherName && phoneNumber) {
      const parentId = `F${Date.now()}`;
      const existingParent = await Parent.findOne({ parentId, name: fatherName });
      if (!existingParent) {
        await Parent.create({
          parentId,
          name: fatherName,
          gender: 'Male',
          occupation: fatherOccupation,
          address: presentAddress,
          mobile: phoneNumber,
          email,
          photo: parentsPhotoPath || 'https://ui-avatars.com/api/?name=Parent&background=random',
        });
      }
    }
    // Save mother as parent
    if (motherName && phoneNumber) {
      const parentId = `M${Date.now()}`;
      const existingParent = await Parent.findOne({ parentId, name: motherName });
      if (!existingParent) {
        await Parent.create({
          parentId,
          name: motherName,
          gender: 'Female',
          occupation: motherOccupation,
          address: presentAddress,
          mobile: phoneNumber,
          email,
          photo: parentsPhotoPath || 'https://ui-avatars.com/api/?name=Parent&background=random',
        });
      }
    }

    res.status(201).json({ success: true, message: 'Student added successfully!', student: newStudent });
  } catch (error) {
    // If saving fails, delete the uploaded files to prevent orphan files
    if (req.files && req.files.studentPhoto && req.files.studentPhoto[0]) {
      fs.unlink(req.files.studentPhoto[0].path, (err) => {
        if (err) console.error('Error deleting student photo:', err);
      });
    }
    if (req.files && req.files.parentsPhoto && req.files.parentsPhoto[0]) {
      fs.unlink(req.files.parentsPhoto[0].path, (err) => {
        if (err) console.error('Error deleting parents photo:', err);
      });
    }
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Could not add student.', error: error.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Could not fetch students.', error: error.message });
  }
}; 