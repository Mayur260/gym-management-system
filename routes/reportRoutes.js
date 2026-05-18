const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

router.get('/', requireAuth, reportController.getReportsPage);
router.get('/dashboard', requireAuth, reportController.getDashboardPage);

module.exports = router;
