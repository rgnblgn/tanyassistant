process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());

const PORT = 4000;

const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const JIRA_PASSWORD = process.env.JIRA_PASSWORD;
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_PROJECT_KEY = 'TYS'; // kendi proje kodunla değiştir

const authHeader = 'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_PASSWORD}`).toString('base64');


app.post('/api/jira-login', express.json(), async (req, res) => {
  const { username, password } = req.body;
   let username2 = "ergin.bilgin"
   let pass = "der65HJK65!"
  try {
    const loginResponse = await fetch(`https://support.asiselektronik.com.tr/rest/auth/1/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    console.log(loginResponse)

    const data = await loginResponse.json();

    if (!loginResponse.ok) {
      return res.status(loginResponse.status).json({
        error: 'Giriş başarısız',
        message: data,
      });
    }

    const session = data.session;
    const cookie = `${session.name}=${session.value}`;

    res.json({ message: 'Giriş başarılı', cookie });
  } catch (err) {
    console.error('Giriş hatası:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/api/myself', async (req, res) => {
    console.log(authHeader);
  try {
    const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/myself`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
    });
    console.log("bjk",response)

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Jira /myself başarısız',
        message: data,
      });
    }

    res.json({
      displayName: data.displayName,
      emailAddress: data.emailAddress,
      accountId: data.accountId,
      timeZone: data.timeZone,
    });
  } catch (err) {
    console.error('Jira /myself hata:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/issues', async (req, res) => {
    console.log('TOKEN:', process.env.JIRA_TOKEN);
  const jql = `project=${JIRA_PROJECT_KEY} ORDER BY updated DESC`;
  const url = `${JIRA_BASE_URL}/rest/api/2/search?jql=${encodeURIComponent(jql)}&maxResults=10`;

  try {
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
    });
    //console.log("atiba",response)

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Jira fetch failed' });
    }

    const data = await response.json();

    const issues = data.issues.map(issue => ({
      id: issue.id,
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status?.name || 'Unknown',
      assignee: issue.fields.assignee?.displayName || 'Unassigned',
    }));

    res.json(issues);
  } catch (err) {
    console.error('Jira API error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/ping', (req, res) => {
  res.json({ message: 'API çalışıyor' });
});

app.listen(PORT, () => {
  console.log(`Backend http://localhost:${PORT}`);
});
