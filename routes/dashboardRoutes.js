const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getFinancialData,
  getRecentActivities,
  getAllDashboardData
} = require('../controllers/dashboardController');

// Get dashboard statistics only
router.get('/stats', getDashboardStats);

// Get financial data for charts
router.get('/financial', getFinancialData);

// Get recent activities
router.get('/activities', getRecentActivities);

// Get all dashboard data in one request
router.get('/all', getAllDashboardData);

module.exports = router;
