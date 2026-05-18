const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/authMiddleware');
const trainerController = require('../controllers/trainerController');

router.get('/', requireAuth, trainerController.getTrainersPage);
router.get('/add', requireAuth, trainerController.getAddTrainerPage);
router.post('/add', requireAuth, trainerController.addTrainer);
router.get('/edit/:id', requireAuth, trainerController.getEditTrainerPage);
router.post('/update/:id', requireAuth, trainerController.updateTrainer);
router.post('/delete/:id', requireAuth, trainerController.deleteTrainer);

module.exports = router;
