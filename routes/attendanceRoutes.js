const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');
const attendanceController = require('../controllers/attendanceController');

router.get('/', requireAuth, attendanceController.getAttendancePage);
router.get('/add', requireAuth, attendanceController.getAddAttendancePage);
router.post('/add', requireAuth, attendanceController.addAttendance);
router.get('/edit/:id', requireAuth, attendanceController.getEditAttendancePage);
router.post('/update/:id', requireAuth, attendanceController.updateAttendance);
router.post('/delete/:id', requireAuth, attendanceController.deleteAttendance);

module.exports = router;
