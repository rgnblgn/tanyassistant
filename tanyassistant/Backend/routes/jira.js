// routes/jira.js
const express = require('express');
const https = require('https');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require('../authMiddleware');
const statusMapping = require('./statusMapping.js');
const moment = require('moment');
const { decrypt } = require('../utils/encryption');

router.use('/status-mapping', statusMapping);

router.get('/getUserIssues', authMiddleware, async (req, res) => {
  const { jiraUsername, jiraPassword, jiraBaseUrl } = req.user;
  const username = req.query.username
  const decryptedPassword = decrypt(jiraPassword);
  const trustedUrls = (process.env.JIRA_BASE_URLS || '')
    .split(',')
    .map(url => url.trim());
  const useUnsafeAgent = trustedUrls.includes(jiraBaseUrl);
  const agent = useUnsafeAgent
    ? new https.Agent({ rejectUnauthorized: false })
    : new https.Agent({ cert: process.env.CERT_PEM_CONTENT, rejectUnauthorized: true });
  const auth = Buffer.from(`${jiraUsername}:${decryptedPassword}`).toString('base64');
  const fetchUrl = `${jiraBaseUrl}rest/api/2/search?jql=assignee=${username} AND resolution=Unresolved&maxResults=200`;
  console.log('jiraBaseUrl', jiraBaseUrl);
  console.log('trustedUrls', trustedUrls);
  console.log('useUnsafeAgent', useUnsafeAgent);
  console.log('fetchUrl', fetchUrl);

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

router.get('/logs', authMiddleware, async (req, res) => {
  const { username, range } = req.query;
  const { jiraBaseUrl, authToken } = req.user;
  const trustedUrls = (process.env.JIRA_BASE_URLS || '')
    .split(',')
    .map(url => url.trim());
  const useUnsafeAgent = trustedUrls.includes(jiraBaseUrl);
  const agent = useUnsafeAgent
    ? new https.Agent({ rejectUnauthorized: false })
    : new https.Agent({ cert: process.env.CERT_PEM_CONTENT, rejectUnauthorized: true });
  if (!username || !range) {
    return res.status(400).json({ error: 'Eksik parametre' });
  }

  let startDate;
  if (range === 'lastWeek') {
    startDate = moment().subtract(7, 'days');
  } else if (range === 'last2Weeks') {
    startDate = moment().subtract(14, 'days');
  } else {
    return res.status(400).json({ error: 'Geçersiz range' });
  }

  const jql = `worklogAuthor = ${username} AND worklogDate >= "${startDate.format('YYYY-MM-DD')}"`;
  const url = `${jiraBaseUrl}rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=1000`;
  try {
    const result = await axios.get(url, {
      headers: {
        Authorization: `Basic ${authToken}`,
        Accept: 'application/json',
      },
      httpsAgent: agent
    });

    const logs = [];

    for (const issue of result.data.issues) {

      const worklogsUrl = `${jiraBaseUrl}rest/api/2/issue/${issue.key}/worklog`;
      const worklogResult = await axios.get(worklogsUrl, {
        headers: {
          Authorization: `Basic ${authToken}`,
          Accept: 'application/json',
        },
        httpsAgent: agent
      });

      const filtered = worklogResult.data.worklogs.filter(w =>
        w.author.name === username &&
        moment(w.started).isAfter(startDate)
      );

      filtered.forEach(w => {
        logs.push({
          issueKey: issue.key,
          summary: issue.fields.summary,
          started: w.started,
          dateOnly: moment(w.started).format('YYYY-MM-DD'), // Gün formatı
          timeSpentSeconds: w.timeSpentSeconds,
          timeSpent: (w.timeSpentSeconds / 3600).toFixed(2) // saat olarak
        });
      });
    }

    res.json({ logs });
  } catch (err) {
    console.error('Jira logs error:', err.message);
    console.error(`Issue  worklog error:`, err.response?.status, err.response?.data);
    res.status(500).json({ error: 'Jira API error', details: err.message });
  }
});


router.get('/getAllStatus', authMiddleware, async (req, res) => {
  const { jiraUsername, jiraPassword, jiraBaseUrl } = req.user;
  const decryptedPassword = decrypt(jiraPassword);
  const trustedUrls = (process.env.JIRA_BASE_URLS || '')
    .split(',')
    .map(url => url.trim());
  const useUnsafeAgent = trustedUrls.includes(jiraBaseUrl);
  const agent = useUnsafeAgent
    ? new https.Agent({ rejectUnauthorized: false }) // Sertifika doğrulama kapalı
    : new https.Agent({ cert: process.env.CERT_PEM_CONTENT, rejectUnauthorized: true }); // Sertifika doğrulama açık

  const auth = Buffer.from(`${jiraUsername}:${decryptedPassword}`).toString('base64');
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
