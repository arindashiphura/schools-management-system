const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const Notice = require('../models/Notice');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts for each entity
    const [
      studentCount,
      teacherCount,
      parentCount,
      totalPayments,
      totalExpenses,
      recentNotices
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Parent.countDocuments(),
      Payment.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Expense.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Notice.find().sort({ date: -1 }).limit(5)
    ]);

    // Calculate total earnings (payments - expenses)
    const totalPaymentAmount = totalPayments[0]?.total || 0;
    const totalExpenseAmount = totalExpenses[0]?.total || 0;
    const totalEarnings = totalPaymentAmount - totalExpenseAmount;

    const stats = {
      students: studentCount,
      teachers: teacherCount,
      parents: parentCount,
      totalEarnings: totalEarnings,
      totalPayments: totalPaymentAmount,
      totalExpenses: totalExpenseAmount
    };

    res.status(200).json({
      success: true,
      stats,
      notices: recentNotices
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get financial data for charts
exports.getFinancialData = async (req, res) => {
  try {
    // Get time period from query params (default to current year)
    const { period = 'year', year, month } = req.query;
    
    let startDate, endDate;
    let groupBy, labels;

    if (period === 'year') {
      const targetYear = year ? parseInt(year) : new Date().getFullYear();
      startDate = new Date(targetYear, 0, 1);
      endDate = new Date(targetYear, 11, 31);
      groupBy = { $month: "$createdAt" };
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    } else if (period === 'month') {
      const targetYear = year ? parseInt(year) : new Date().getFullYear();
      const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();
      startDate = new Date(targetYear, targetMonth, 1);
      endDate = new Date(targetYear, targetMonth + 1, 0);
      groupBy = { $dayOfMonth: "$createdAt" };
      
      const daysInMonth = endDate.getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }

    const [monthlyPayments, monthlyExpenses, totalPayments, totalExpenses] = await Promise.all([
      Payment.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: groupBy,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]),
      Expense.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: groupBy,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ]),
      Payment.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
      ]),
      Expense.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
      ])
    ]);

    // Format data for chart
    const paymentData = new Array(labels.length).fill(0);
    const expenseData = new Array(labels.length).fill(0);

    monthlyPayments.forEach(item => {
      const index = item._id - 1; // For months (1-12) convert to 0-11, for days use as is
      if (index >= 0 && index < labels.length) {
        paymentData[index] = item.total;
      }
    });

    monthlyExpenses.forEach(item => {
      const index = item._id - 1; // For months (1-12) convert to 0-11, for days use as is
      if (index >= 0 && index < labels.length) {
        expenseData[index] = item.total;
      }
    });

    const totalPaymentAmount = totalPayments[0]?.total || 0;
    const totalExpenseAmount = totalExpenses[0]?.total || 0;
    const currentPeriodCollection = paymentData.reduce((sum, val) => sum + val, 0);
    const currentPeriodExpenses = expenseData.reduce((sum, val) => sum + val, 0);

    res.status(200).json({
      success: true,
      data: {
        labels: labels,
        payments: paymentData,
        expenses: expenseData,
        collection: Math.round(currentPeriodCollection / 1000) || 100, // Convert to thousands for chart
        fees: Math.round(currentPeriodCollection / 1200) || 75, // Estimated fees
        expenses: Math.round(currentPeriodExpenses / 1000) || 50, // Convert to thousands for chart
        summary: {
          totalPayments: totalPaymentAmount,
          totalExpenses: totalExpenseAmount,
          currentPeriodCollection: currentPeriodCollection,
          currentPeriodExpenses: currentPeriodExpenses,
          netIncome: currentPeriodCollection - currentPeriodExpenses,
          paymentCount: totalPayments[0]?.count || 0,
          expenseCount: totalExpenses[0]?.count || 0
        },
        period: period,
        dateRange: {
          start: startDate,
          end: endDate
        }
      }
    });
  } catch (error) {
    console.error('Financial data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial data',
      error: error.message
    });
  }
};

// Get recent activities
exports.getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get recent activities from different models
    const [recentStudents, recentTeachers, recentPayments, recentExpenses] = await Promise.all([
      Student.find().sort({ createdAt: -1 }).limit(3).select('firstName lastName createdAt'),
      Teacher.find().sort({ createdAt: -1 }).limit(2).select('firstName lastName createdAt'),
      Payment.find().sort({ createdAt: -1 }).limit(3).select('studentName amount createdAt'),
      Expense.find().sort({ createdAt: -1 }).limit(2).select('description amount createdAt')
    ]);

    // Format activities
    const activities = [];
    let id = 1;

    recentStudents.forEach(student => {
      activities.push({
        id: id++,
        description: `New student ${student.firstName} ${student.lastName} was admitted`,
        time: getTimeAgo(student.createdAt),
        type: 'student',
        timestamp: student.createdAt
      });
    });

    recentTeachers.forEach(teacher => {
      activities.push({
        id: id++,
        description: `New teacher ${teacher.firstName} ${teacher.lastName} was added`,
        time: getTimeAgo(teacher.createdAt),
        type: 'teacher',
        timestamp: teacher.createdAt
      });
    });

    recentPayments.forEach(payment => {
      activities.push({
        id: id++,
        description: `Payment of $${payment.amount} received from ${payment.studentName}`,
        time: getTimeAgo(payment.createdAt),
        type: 'payment',
        timestamp: payment.createdAt
      });
    });

    recentExpenses.forEach(expense => {
      activities.push({
        id: id++,
        description: `New expense: ${expense.description} - $${expense.amount}`,
        time: getTimeAgo(expense.createdAt),
        type: 'expense',
        timestamp: expense.createdAt
      });
    });

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const limitedActivities = activities.slice(0, limit);

    res.status(200).json({
      success: true,
      activities: limitedActivities
    });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activities',
      error: error.message
    });
  }
};

// Get all dashboard data in one request
exports.getAllDashboardData = async (req, res) => {
  try {
    // Get all data in parallel
    const [
      studentCount,
      teacherCount,
      parentCount,
      totalPayments,
      totalExpenses,
      recentNotices,
      recentStudents,
      recentTeachers,
      recentPayments,
      recentExpensesData
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Parent.countDocuments(),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      Notice.find().sort({ date: -1 }).limit(5),
      Student.find().sort({ createdAt: -1 }).limit(3).select('firstName lastName createdAt'),
      Teacher.find().sort({ createdAt: -1 }).limit(2).select('firstName lastName createdAt'),
      Payment.find().sort({ createdAt: -1 }).limit(3).select('studentName amount createdAt'),
      Expense.find().sort({ createdAt: -1 }).limit(2).select('description amount createdAt')
    ]);

    // Calculate totals
    const totalPaymentAmount = totalPayments[0]?.total || 0;
    const totalExpenseAmount = totalExpenses[0]?.total || 0;
    const totalEarnings = totalPaymentAmount - totalExpenseAmount;

    // Format activities
    const activities = [];
    let id = 1;

    recentStudents.forEach(student => {
      activities.push({
        id: id++,
        description: `New student ${student.firstName} ${student.lastName} was admitted`,
        time: getTimeAgo(student.createdAt),
        type: 'student',
        timestamp: student.createdAt
      });
    });

    recentTeachers.forEach(teacher => {
      activities.push({
        id: id++,
        description: `New teacher ${teacher.firstName} ${teacher.lastName} was added`,
        time: getTimeAgo(teacher.createdAt),
        type: 'teacher',
        timestamp: teacher.createdAt
      });
    });

    recentPayments.forEach(payment => {
      activities.push({
        id: id++,
        description: `Payment of $${payment.amount} received from ${payment.studentName}`,
        time: getTimeAgo(payment.createdAt),
        type: 'payment',
        timestamp: payment.createdAt
      });
    });

    recentExpensesData.forEach(expense => {
      activities.push({
        id: id++,
        description: `New expense: ${expense.description} - $${expense.amount}`,
        time: getTimeAgo(expense.createdAt),
        type: 'expense',
        timestamp: expense.createdAt
      });
    });

    // Sort activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Format notices
    const formattedNotices = recentNotices.map((notice, index) => ({
      id: notice._id,
      date: new Date(notice.date).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
      title: notice.title,
      description: notice.details,
      time: getTimeAgo(notice.createdAt || notice.date),
      expanded: false
    }));

    const dashboardData = {
      stats: {
        students: studentCount,
        teachers: teacherCount,
        parents: parentCount,
        totalEarnings: totalEarnings,
        totalPayments: totalPaymentAmount,
        totalExpenses: totalExpenseAmount
      },
      socialMedia: {
        facebook: 30000,
        twitter: 13000,
        googlePlus: 9000,
        linkedin: 18000
      },
      notices: formattedNotices,
      activities: activities.slice(0, 10),
      feesData: {
        collection: Math.round(totalPaymentAmount / 1000) || 100,
        fees: Math.round(totalPaymentAmount / 1200) || 75,
        expenses: Math.round(totalExpenseAmount / 1000) || 50
      }
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('All dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(date));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    return new Date(date).toLocaleDateString();
  }
}
