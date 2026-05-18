const bcrypt = require('bcrypt');
const db = require('../config/db');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await db.query(
            'SELECT * FROM admins WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.send('Invalid email or password');
        }

        const admin = rows[0];

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.send('Invalid email or password');
        }

        req.session.user = {
            id: admin.id,
            name: admin.full_name,
            email: admin.email
        };

        res.redirect('/dashboard');

    } catch (error) {
        console.error(error);
        res.send('Server Error');
    }
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

module.exports = {
    login,
    logout
};
