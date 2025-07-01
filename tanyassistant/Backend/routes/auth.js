// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'supersecret';

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // İsteğe bağlı: Burada bir test Jira API isteği atabilirsin. Eğer 200 dönerse login başarılıdır.
    if (!email || !password) {
        return res.status(400).json({ message: 'Email ve şifre zorunludur' });
    }

    const token = jwt.sign({ email, password }, SECRET, { expiresIn: '8h' });

    res.json({ token });
});

module.exports = router;
