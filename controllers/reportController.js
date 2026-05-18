const reportModel = require('../models/reportModel');

const fallbackStats = {
  totalMembers: 0,
  activeMemberships: 0,
  totalTrainers: 0,
  monthlyRevenue: 0,
  pendingPayments: 0,
  todayAttendanceCount: 0
};

const fallbackRevenue = {
  labels: ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026'],
  values: [12000, 15800, 14900, 17700, 16600, 19200]
};

const fallbackAttendance = {
  labels: ['01 May', '02 May', '03 May', '04 May', '05 May', '06 May', '07 May'],
  values: [34, 29, 41, 38, 45, 33, 27]
};

const fallbackMembership = {
  labels: ['Monthly', 'Quarterly', 'Annual'],
  values: [26, 18, 34]
};

const buildDashboardData = async () => {
  const stats = await reportModel.getDashboardStats();
  const monthlyRevenueChart = await reportModel.getMonthlyRevenueChart();
  const attendanceTrendChart = await reportModel.getAttendanceTrendChart();
  const membershipDistributionChart = await reportModel.getMembershipDistributionChart();
  const recentMembers = await reportModel.getRecentMembers();
  const recentActivity = await reportModel.getRecentActivity();

  const safeRevenue = monthlyRevenueChart?.labels?.length ? monthlyRevenueChart : fallbackRevenue;
  const safeAttendance = attendanceTrendChart?.labels?.length ? attendanceTrendChart : fallbackAttendance;
  const safeMembership = membershipDistributionChart?.labels?.length ? membershipDistributionChart : fallbackMembership;

  return {
    stats: stats || fallbackStats,
    monthlyRevenueChart: safeRevenue,
    attendanceTrendChart: safeAttendance,
    membershipDistributionChart: safeMembership,
    revenueLabels: safeRevenue.labels,
    revenueValues: safeRevenue.values,
    attendanceLabels: safeAttendance.labels,
    attendanceValues: safeAttendance.values,
    membershipLabels: safeMembership.labels,
    membershipValues: safeMembership.values,
    recentMembers: recentMembers || [],
    recentActivity: recentActivity || []
  };
};

const getDashboardPage = async (req, res) => {
  try {
    const dashboardData = await buildDashboardData();
    res.render('dashboard', {
      title: 'Dashboard - IronForge GMS',
      ...dashboardData
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    req.flash('error', 'Failed to load dashboard.');
    res.render('dashboard', {
      title: 'Dashboard - IronForge GMS',
      stats: fallbackStats,
      monthlyRevenueChart: fallbackRevenue,
      attendanceTrendChart: fallbackAttendance,
      membershipDistributionChart: fallbackMembership,
      revenueLabels: fallbackRevenue.labels,
      revenueValues: fallbackRevenue.values,
      attendanceLabels: fallbackAttendance.labels,
      attendanceValues: fallbackAttendance.values,
      membershipLabels: fallbackMembership.labels,
      membershipValues: fallbackMembership.values,
      recentMembers: [],
      recentActivity: []
    });
  }
};

const getReportsPage = async (req, res) => {
  try {
    const {
      stats,
      monthlyRevenueChart,
      attendanceTrendChart,
      membershipDistributionChart
    } = await buildDashboardData();

    res.render('reports', {
      title: 'Reports - IronForge GMS',
      stats,
      monthlyRevenueChart,
      attendanceTrendChart,
      membershipDistributionChart
    });
  } catch (error) {
    console.error('Error loading reports:', error);
    req.flash('error', 'Failed to load reports.');
    res.redirect('/dashboard');
  }
};

module.exports = {
  getDashboardPage,
  getReportsPage
};
