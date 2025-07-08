// routes/jira.js
const express = require('express');
const https = require('https');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const statusMapping = require('./statusMapping.js');


const agent = new https.Agent({ rejectUnauthorized: false }); // Sertifika doğrulamasını kapat
router.use('/status-mapping', statusMapping);

router.get('/getUserIssues', authMiddleware, async (req, res) => {
  const { jiraUsername, jiraPassword, jiraBaseUrl } = req.user;
  const username = req.query.username

  const auth = Buffer.from(`${jiraUsername}:${jiraPassword}`).toString('base64');
  const fetchUrl = `${jiraBaseUrl}rest/api/2/search?jql=assignee=${username} AND resolution=Unresolved&maxResults=200`;
  try {
    const result = await axios.get(fetchUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
      httpsAgent: agent
    });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Jira API error', details: err.message });
  }
});

router.get('/getAllStatus', authMiddleware, async (req, res) => {
  const { jiraUsername, jiraPassword, jiraBaseUrl } = req.user;

  const auth = Buffer.from(`${jiraUsername}:${jiraPassword}`).toString('base64');
  const fetchUrl = `${jiraBaseUrl}rest/api/2/status`;
  try {
    const result = await axios.get(fetchUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
      httpsAgent: agent
    });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Jira API error', details: err.message });
  }
});

module.exports = router;
