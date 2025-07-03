// Backend/routes/auth.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User'); // MongoDB model
const sessionStore = require('../sessionStore'); // Geçici session store (Redis önerilir)

// Kullanıcı login endpoint
router.post('/login', async (req, res) => {
    try {
        const { jiraUsername, jiraPassword, jiraBaseUrl } = req.body;
        let email = jiraUsername
        if (!jiraUsername || !jiraPassword || !jiraBaseUrl) {
            return res.status(400).json({ error: 'Eksik bilgi' });
        }

        const authToken = Buffer.from(`${jiraUsername}:${jiraPassword}`).toString('base64');

        const user = {
            email,
            authToken,
            jiraBaseUrl,
            createdAt: new Date(),
            jiraUsername,
            jiraPassword
        };

        await User.updateOne(
            { email },
            { $set: user },
            { upsert: true }
        );

        const sessionToken = crypto.randomBytes(24).toString('hex');
        sessionStore.set(sessionToken, { email });
        res.json({ token: sessionToken });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});

module.exports = router;
