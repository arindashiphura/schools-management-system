require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const studentRoutes = require('./routes/studentRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const classRoutes = require('./routes/classRoutes');
const parentRoutes = require('./routes/parentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const bookRoutes = require('./routes/bookRoutes');
const expenseRoutes = require('./routes/expenseRoutes');


const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

connectDB();

app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/notices", noticeRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/parents", parentRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/expenses", expenseRoutes);


// Serve upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
