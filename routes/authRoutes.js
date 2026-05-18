const express = require('express');
const router = express.Router();

const {
    login,
    logout
} = require('../controllers/authController');

// Root route — redirect to login or dashboard
router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    }
    res.redirect('/login');
});

// Login page
router.get('/login', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('index', {
        title:    'Login — IronForge GMS',
        messages: req.flash()
    });
});

router.post('/login', login);

router.get('/logout', logout);

module.exports = router;
