const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

router.get('/', requireAuth, paymentController.getPaymentsPage);
router.get('/add', requireAuth, paymentController.getAddPaymentPage);
router.post('/add', requireAuth, paymentController.addPayment);
router.get('/edit/:id', requireAuth, paymentController.getEditPaymentPage);
router.post('/update/:id', requireAuth, paymentController.updatePayment);
router.post('/delete/:id', requireAuth, paymentController.deletePayment);

module.exports = router;
