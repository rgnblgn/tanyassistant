const axios = require('axios');
const https = require('https');
const express = require('express');

const router = express.Router();

const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_PASSWORD = process.env.JIRA_PASSWORD;
const JIRA_USERNAME = process.env.JIRA_USERNAME;

const httpsAgent = new https.Agent({ rejectUnauthorized: false }); // Sertifika doğrulamasını kapat

router.get('/my-issues', async (req, res) => {
  const auth = Buffer.from(`${JIRA_USERNAME}:${JIRA_PASSWORD}`).toString('base64');

  try {
    const response = await axios.get(`${JIRA_BASE_URL}rest/api/2/myself`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      },
      httpsAgent // burası önemli
    });

    res.json(response.data);
  } catch (err) {
    console.error('Jira API error:', err.message);
    res.status(500).json({ error: 'Jira API çağrısı başarısız' });
  }
});

router.get('/getUserIssues', async (req, res) => {
  const auth = Buffer.from(`${JIRA_USERNAME}:${JIRA_PASSWORD}`).toString('base64');
    const userName = req.query.username
  try {
    const response = await axios.get(`${JIRA_BASE_URL}rest/api/2/search?jql=assignee=${userName} AND resolution=Unresolved`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json'
      },
      httpsAgent // burası önemli
    });

    res.json(response.data);
  } catch (err) {
    console.error('Jira API error:', err.message);
    res.status(500).json({ error: 'Jira API çağrısı başarısız' });
  }
});

module.exports = router;
