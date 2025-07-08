const express = require('express');
const router = express.Router();
const StatusMapping = require('../models/StatusMapping');
const authMiddleware = require('../authMiddleware');

// GET /api/jira/status-mapping
router.get('/', authMiddleware, async (req, res) => {
    const username = req.user.jiraUsername;
    const data = await StatusMapping.findOne({ username });
    res.json(data?.mapping || {});
});

// POST /api/jira/status-mapping
router.post('/', authMiddleware, async (req, res) => {
    const username = req.user.jiraUsername;
    const { mapping } = req.body;

    if (!mapping) return res.status(400).json({ error: 'Eksik veri' });

    await StatusMapping.updateOne(
        { username },
        { $set: { mapping } },
        { upsert: true }
    );
    res.json({ success: true });
});
module.exports = router;