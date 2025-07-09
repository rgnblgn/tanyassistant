// Backend/routes/auth.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User'); // MongoDB model
const sessionStore = require('../sessionStore'); // Geçici session store (Redis önerilir)
const authMiddleware = require('../authMiddleware');


// Kullanıcı login endpoint
router.post('/login', async (req, res) => {
    try {
        const { jiraUsername, jiraPassword } = req.body;
        let email = jiraUsername
        if (!jiraUsername || !jiraPassword) {
            return res.status(400).json({ error: 'Eksik bilgi' });
        }

        const authToken = Buffer.from(`${jiraUsername}:${jiraPassword}`).toString('base64');

        const user = {
            email,
            authToken,
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


router.post('/setJiraBaseUrl', authMiddleware, async (req, res) => {
    try {
        const { jiraBaseUrl } = req.body;

        if (!jiraBaseUrl) {
            return res.status(400).json({ error: 'Eksik bilgi' });
        }

        const user = req.user
        const email = req.user.email
        await User.updateOne({ email }, { $set: { jiraBaseUrl } });
        res.json({ data: "İşlem tamam" });
    } catch (err) {
        console.error('Baseurl error:', err);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
});
module.exports = router;
