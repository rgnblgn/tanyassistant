// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Meeting from './pages/Meeting';
import Daily from './pages/Daily';
import AiNotes from './pages/aiNotes';
import JiraPage from './pages/Jirapage';
import Login from './pages/Login';
import Teams from './pages/teams';

const App = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  return (
    <div >
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '16px' }}>
        <a href="/" className="logo">
          <img src="/tanyaIcon.webp" alt="Logo" style={{ height: 50 }} />
          Tanya the Assistant
        </a>
        <div className="nav-links">
          <Link to="/" style={{ marginRight: '20px' }}>Anasayfa</Link>
          <Link to="/meeting" style={{ marginRight: '20px' }}>Meeting</Link>
          <Link to="/daily" style={{ marginRight: '20px' }}>Daily</Link>
          <Link to="/aiNotes">Ai Notes</Link>
          <Link to="/teams" style={{ marginRight: '20px' }}>Teams</Link>
          <Link to="/csv" style={{ marginRight: '20px' }}>CSV ile Yükle</Link>


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
        <Route path="/" element={isLoggedIn ? <JiraPage /> : <Navigate to="/login" />} />
        <Route path="/csv" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/meeting" element={isLoggedIn ? <Meeting /> : <Navigate to="/login" />} />
        <Route path="/daily" element={isLoggedIn ? <Daily /> : <Navigate to="/login" />} />
        <Route path="/aiNotes" element={isLoggedIn ? <AiNotes /> : <Navigate to="/login" />} />
        <Route path="/teams" element={isLoggedIn ? <Teams /> : <Navigate to="/login" />} />


      </Routes>
    </div>
  );
};

export default App;
