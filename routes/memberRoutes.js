const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');
const memberController = require('../controllers/memberController');

router.get('/', requireAuth, memberController.getMembersPage);
router.get('/add', requireAuth, memberController.getAddMemberPage);
router.post('/add', requireAuth, memberController.addMember);
router.get('/edit/:id', requireAuth, memberController.getEditMemberPage);
router.post('/update/:id', requireAuth, memberController.updateMember);
router.post('/delete/:id', requireAuth, memberController.deleteMember);

module.exports = router;
