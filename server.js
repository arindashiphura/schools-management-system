require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const groupRoutes = require('./routes/groupRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const classRoutes = require('./routes/classRoutes');
const parentRoutes = require('./routes/parentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const teacherRequestRoutes = require('./routes/teacherRequestRoutes');
const bookRoutes = require('./routes/bookRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const classRoutineRoutes = require('./routes/classRoutineRoutes');
const examScheduleRoutes = require('./routes/examScheduleRoutes');
const examGradeRoutes = require('./routes/examGradeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const feeStructureRoutes = require('./routes/feeStructureRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');


const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.get("/test", (req, res) => {
  res.send("Test route working");
});

app.use(express.json());

connectDB();

app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/groups", groupRoutes);
app.use("/api/v1/notices", noticeRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/parents", parentRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/teacher-requests", teacherRequestRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/class-routine", classRoutineRoutes);
app.use("/api/v1/exam-schedule", examScheduleRoutes);
app.use("/api/v1/exam-grades", examGradeRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/fee-structures", feeStructureRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);


// Serve upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
