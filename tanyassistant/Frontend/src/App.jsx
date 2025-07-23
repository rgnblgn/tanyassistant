import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Meeting from './pages/Meeting';
import Daily from './pages/Daily';
import AiNotes from './pages/AiNotes';
import JiraPage from './pages/Jirapage';
import Login from './pages/Login';
import Teams from './pages/Teams.jsx';
import CreateYourJira from './pages/CreateYourJira'
import LogWork from './pages/LogWork.jsx'
import Home from './pages/Home.jsx'

const App = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  return (
    <div >
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '16px' }}>
        <Link to="/" className='logo'><img src="/tanyaIcon.webp" alt="Logo" style={{ height: 50 }} />
          Tanya the Assistant</Link>
        <div className="nav-links">
          <Link to="/" style={{ marginRight: '20px' }}>Anasayfa</Link>
          <Link to="/jira" style={{ marginRight: '20px' }}>Jira Issues</Link>
          <Link to="/meeting" style={{ marginRight: '20px' }}>Meeting</Link>
          <Link to="/daily" style={{ marginRight: '20px' }}>Daily</Link>
          <Link to="/aiNotes">Ai Notes</Link>
          <Link to="/createYourJira" style={{ marginRight: '20px' }}>createYourJira</Link>
          <Link to="/logWork" style={{ marginRight: '20px' }}>LogWork</Link>
          {isLoggedIn && (
            <button onClick={() => {
              localStorage.removeItem('authToken');
              setIsLoggedIn(false);
              navigate('/login');
            }} style={{ float: "right" }}>
              Logout
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login onLogin={() => { setIsLoggedIn(true); window.location.href = "/" }} />} />
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/jira" element={isLoggedIn ? <JiraPage /> : <Navigate to="/login" />} />
        <Route path="/logWork" element={isLoggedIn ? <LogWork /> : <Navigate to="/login" />} />
        <Route path="/meeting" element={isLoggedIn ? <Meeting /> : <Navigate to="/login" />} />
        <Route path="/daily" element={isLoggedIn ? <Daily /> : <Navigate to="/login" />} />
        <Route path="/aiNotes" element={isLoggedIn ? <AiNotes /> : <Navigate to="/login" />} />
        <Route path="/createYourJira" element={isLoggedIn ? <CreateYourJira /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
