const attendanceModel = require('../models/attendanceModel');

const getAttendancePage = async (req, res) => {
  try {
    const attendanceRecords = await attendanceModel.getAllAttendance();

    res.render('attendance', {
      title: 'Attendance - IronForge GMS',
      attendanceRecords
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    req.flash('error', 'Failed to load attendance.');
    res.redirect('/dashboard');
  }
};

const getAddAttendancePage = async (req, res) => {
  try {
    const members = await attendanceModel.getMemberOptions();
    res.render('add-attendance', {
      title: 'Add Attendance - IronForge GMS',
      attendance: null,
      members: members || [],
      formAction: '/attendance/add',
      submitLabel: 'Save Attendance'
    });
  } catch (error) {
    console.error('Error loading add attendance page:', error);
    req.flash('error', 'Failed to load attendance form.');
    res.redirect('/attendance');
  }
};

const addAttendance = async (req, res) => {
  try {
    await attendanceModel.createAttendance(req.body);
    req.flash('success', 'Attendance record added successfully.');
    res.redirect('/attendance');
  } catch (error) {
    console.error('Error adding attendance:', error);
    req.flash('error', 'Failed to add attendance record.');
    res.redirect('/attendance/add');
  }
};

const getEditAttendancePage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      req.flash('error', 'Invalid attendance ID.');
      return res.redirect('/attendance');
    }
    const attendance = await attendanceModel.getAttendanceById(id);
    const members = await attendanceModel.getMemberOptions();

    if (!attendance) {
      req.flash('error', 'Attendance record not found.');
      return res.redirect('/attendance');
    }

    res.render('add-attendance', {
      title: 'Edit Attendance - IronForge GMS',
      attendance,
      members: members || [],
      formAction: `/attendance/update/${attendance.id}`,
      submitLabel: 'Update Attendance'
    });
  } catch (error) {
    console.error('Error loading edit attendance page:', error);
    req.flash('error', 'Failed to load edit page.');
    res.redirect('/attendance');
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await attendanceModel.updateAttendanceById(id, req.body);

    if (affectedRows === 0) {
      req.flash('error', 'Attendance record not found.');
      return res.redirect('/attendance');
    }

    req.flash('success', 'Attendance record updated successfully.');
    res.redirect('/attendance');
  } catch (error) {
    console.error('Error updating attendance:', error);
    req.flash('error', 'Failed to update attendance record.');
    res.redirect(`/attendance/edit/${req.params.id}`);
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    await attendanceModel.deleteAttendanceById(id);
    req.flash('success', 'Attendance record deleted successfully.');
    res.redirect('/attendance');
  } catch (error) {
    console.error('Error deleting attendance:', error);
    req.flash('error', 'Failed to delete attendance record.');
    res.redirect('/attendance');
  }
};

module.exports = {
  getAttendancePage,
  getAddAttendancePage,
  addAttendance,
  getEditAttendancePage,
  updateAttendance,
  deleteAttendance
};
