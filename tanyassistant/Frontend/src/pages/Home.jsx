import React, { useState, useContext } from 'react';
import { AppContext } from '../AppContext';

const Home = () => {
  const [jiraBaseUrl, setJiraBaseUrl] = useState('');
  const { baseUrl, setBaseUrl } = useContext(AppContext);

  const handleJiraBaseUrl = async (e) => {
    e.preventDefault(); // Formun reload yapmasını engeller
    let token = localStorage.getItem('authToken')

    const res = await fetch('http://localhost:4000/api/auth/setJiraBaseUrl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        jiraBaseUrl
      })
    });

    const data = await res.json()
    if (res.ok) {
      setBaseUrl(jiraBaseUrl)
    } else {
      alert(data.message || 'Baseurl failed');
    }
  };
  return (
    <div>
      {baseUrl &&
        <div>BaseUrl = {baseUrl}</div>
      }
      {!baseUrl &&
        <div>
          <input
            type="url"
            name="jiraBaseUrl"
            placeholder="Jira Base URL (https://... ile)"
            autoComplete="url"
            value={jiraBaseUrl}
            onChange={(e) => setJiraBaseUrl(e.target.value)}
          />
          <button onClick={handleJiraBaseUrl}>Kaydet</button>
        </div>
      }
    </div >
  );
};

export default Home;
