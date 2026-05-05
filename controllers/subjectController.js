const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Uganda secondary school subjects — pre-defined list
const UGANDA_SUBJECTS = [
  // O-Level Compulsory
  { subjectName:'Mathematics',              subjectCode:'MAT', subjectType:'Compulsory', level:'O-Level', classes:['S1','S2','S3','S4'], department:'Sciences' },
  { subjectName:'English Language',         subjectCode:'ENG', subjectType:'Compulsory', level:'O-Level', classes:['S1','S2','S3','S4'], department:'Languages' },
  // O-Level Sciences
  { subjectName:'Physics',                  subjectCode:'PHY', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Sciences' },
  { subjectName:'Chemistry',                subjectCode:'CHE', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Sciences' },
  { subjectName:'Biology',                  subjectCode:'BIO', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Sciences' },
  { subjectName:'Computer Studies',         subjectCode:'COM', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Sciences' },
  // O-Level Humanities
  { subjectName:'Geography',                subjectCode:'GEO', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Humanities' },
  { subjectName:'History',                  subjectCode:'HIS', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Humanities' },
  { subjectName:'Christian Religious Education', subjectCode:'CRE', subjectType:'Elective', level:'O-Level', classes:['S1','S2','S3','S4'], department:'Humanities' },
  { subjectName:'Islamic Religious Education',   subjectCode:'IRE', subjectType:'Elective', level:'O-Level', classes:['S1','S2','S3','S4'], department:'Humanities' },
  { subjectName:'Agriculture',              subjectCode:'AGR', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Humanities' },
  { subjectName:'Commerce',                 subjectCode:'COM2',subjectType:'Elective',   level:'O-Level', classes:['S3','S4'],           department:'Business' },
  // O-Level Languages & Arts
  { subjectName:'Literature in English',    subjectCode:'LIT', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Languages' },
  { subjectName:'French',                   subjectCode:'FRE', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Languages' },
  { subjectName:'Kiswahili',                subjectCode:'KIS', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Languages' },
  { subjectName:'Art & Design',             subjectCode:'ART', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Arts' },
  { subjectName:'Music',                    subjectCode:'MUS', subjectType:'Elective',   level:'O-Level', classes:['S1','S2','S3','S4'], department:'Arts' },
  { subjectName:'Physical Education',       subjectCode:'PE',  subjectType:'Practical',  level:'O-Level', classes:['S1','S2','S3','S4'], department:'Sports' },
  // A-Level
  { subjectName:'General Paper',            subjectCode:'GP',  subjectType:'Compulsory', level:'A-Level', classes:['S5','S6'], department:'Languages' },
  { subjectName:'Subsidiary Mathematics',   subjectCode:'SUB', subjectType:'Subsidiary', level:'A-Level', classes:['S5','S6'], department:'Sciences' },
  { subjectName:'Economics',                subjectCode:'ECO', subjectType:'Elective',   level:'A-Level', classes:['S5','S6'], department:'Business' },
  { subjectName:'Entrepreneurship',         subjectCode:'ENT', subjectType:'Elective',   level:'A-Level', classes:['S5','S6'], department:'Business' },
  { subjectName:'Divinity',                 subjectCode:'DIV', subjectType:'Elective',   level:'A-Level', classes:['S5','S6'], department:'Humanities' },
  { subjectName:'Fine Art',                 subjectCode:'FA',  subjectType:'Elective',   level:'A-Level', classes:['S5','S6'], department:'Arts' },
];

// Seed Uganda subjects (run once)
exports.seedSubjects = async (req, res) => {
  try {
    const existing = await Subject.countDocuments();
    if (existing > 0) {
      return res.status(200).json({ message: `${existing} subjects already exist. Skipping seed.` });
    }
    await Subject.insertMany(UGANDA_SUBJECTS);
    res.status(201).json({ message: `${UGANDA_SUBJECTS.length} Uganda secondary subjects seeded successfully.` });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
};

// Create a subject
exports.createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, subjectType, level, classes, department, description, teacherId } = req.body;
    if (!subjectName || !subjectCode) {
      return res.status(400).json({ message: 'subjectName and subjectCode are required.' });
    }
    let teacherName = '';
    if (teacherId) {
      const teacher = await Teacher.findById(teacherId);
      if (teacher) teacherName = teacher.name;
    }
    const subject = new Subject({ subjectName, subjectCode, subjectType, level, classes, department, description, teacherId, teacherName });
    await subject.save();
    res.status(201).json({ message: 'Subject created', subject });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const { level, department, class: cls } = req.query;
    const filter = {};
    if (level)      filter.level = level;
    if (department) filter.department = department;
    if (cls)        filter.classes = cls;
    const subjects = await Subject.find(filter).sort({ department: 1, subjectName: 1 });
    res.status(200).json({ subjects });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get subjects for a specific class
exports.getSubjectsByClass = async (req, res) => {
  try {
    const subjects = await Subject.find({ classes: req.params.className }).sort({ subjectName: 1 });
    res.status(200).json({ subjects });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Assign teacher to subject
exports.assignTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { teacherId, teacherName: teacher.name },
      { new: true }
    );
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    // Also update teacher's subject field
    await Teacher.findByIdAndUpdate(teacherId, { subject: subject.subjectName });
    res.status(200).json({ message: 'Teacher assigned', subject });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) return res.status(404).json({ message: 'Subject not found.' });
    res.status(200).json({ message: 'Subject updated', subject });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found.' });
    res.status(200).json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get students taking a subject (by class)
exports.getSubjectStudents = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    const students = await Student.find({ class: { $in: subject.classes } })
      .select('firstName lastName rollNo class section studentPhoto');
    res.status(200).json({ subject, students });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
