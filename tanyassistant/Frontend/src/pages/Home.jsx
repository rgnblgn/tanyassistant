import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Meeting from './Meeting';
import Daily from './Daily';
import AiNotes from './AiNotes';
import JiraPage from './Jirapage';
import Teams from './Teams.jsx';
import CreateYourJira from './CreateYourJira'
import LogWork from './LogWork.jsx'
import './Home.css'


const Home = () => {
  const [jiraBaseUrl, setJiraBaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { baseUrl, setBaseUrl } = useContext(AppContext);

  const handleJiraBaseUrl = async (e) => {
    e.preventDefault(); // Formun reload yapmasını engeller
    let token = localStorage.getItem('authToken')

    const res = await fetch('https://tanyassistant.onrender.com/api/auth/setJiraBaseUrl', {
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

  useEffect(() => {
    setIsLoading(true)
    getJiraBaseUrl().then((res) => {
      if (res.jiraBaseUrl) {
        setBaseUrl(res.jiraBaseUrl)

      } else {
        setBaseUrl('')
      }
      setIsLoading(false)
    })

  }, [])

  const getJiraBaseUrl = async () => {
    let token = localStorage.getItem('authToken')

    const res = await fetch('https://tanyassistant.onrender.com/api/auth/getJiraBaseUrl', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    const data = await res.json()
    console.log(data)

    return data
  }

  return (
    <div>
      <div>
        {baseUrl && !isLoading &&
          <div>
            <div className="baseurl-banner">
              Aktif Jira Base URL: <strong>{baseUrl}</strong>
            </div>
            <div >

              <div className="homepage-nav-links">
                <Link to="/jira" >Jira Issues</Link>
                <Link to="/meeting" >Meeting</Link>
                <Link to="/daily" >Daily</Link>
                <Link to="/aiNotes">Ai Notes</Link>
                <Link to="/teams" >Teams</Link>
                <Link to="/createYourJira" >createYourJira</Link>
                <Link to="/logWork" >LogWork</Link>
              </div>


              <Routes>
                <Route path="/jira" element={<JiraPage />} />
                <Route path="/logWork" element={<LogWork />} />
                <Route path="/meeting" element={<Meeting />} />
                <Route path="/daily" element={<Daily />} />
                <Route path="/aiNotes" element={<AiNotes />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/createYourJira" element={<CreateYourJira />} />
              </Routes>
            </div>

          </div>
        }
      </div>
      {!baseUrl && !isLoading &&
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
