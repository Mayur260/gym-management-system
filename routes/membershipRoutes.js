const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');
const membershipController = require('../controllers/membershipController');

router.get('/', requireAuth, membershipController.getMembershipsPage);
router.get('/add', requireAuth, membershipController.getAddMembershipPage);
router.post('/add', requireAuth, membershipController.addMembership);
router.get('/edit/:id', requireAuth, membershipController.getEditMembershipPage);
router.post('/update/:id', requireAuth, membershipController.updateMembership);
router.post('/delete/:id', requireAuth, membershipController.deleteMembership);

module.exports = router;
