// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Meeting from './pages/Meeting';
import Daily from './pages/Daily';
import AiNotes from './pages/aiNotes';
import JiraPage from './pages/Jirapage';
import Login from './pages/Login';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  return (
    <BrowserRouter>
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '16px' }}>
        <Link to="/" style={{ marginRight: '20px' }}>Anasayfa</Link>
        <Link to="/jira" style={{ marginRight: '20px' }}>Jira</Link>
        <Link to="/meeting" style={{ marginRight: '20px' }}>Meeting</Link>
        <Link to="/daily" style={{ marginRight: '20px' }}>Daily</Link>
        <Link to="/aiNotes">Ai Notes</Link>
        <Link to="/logout" style={{ float: "right" }}>logout</Link>

      </nav>

      <Routes>
        <Route path="/login" element={<Login onLogin={() => { setIsLoggedIn(true); window.location.href = "/" }} />} />
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/jira" element={isLoggedIn ? <JiraPage /> : <Navigate to="/login" />} />
        <Route path="/meeting" element={isLoggedIn ? <Meeting /> : <Navigate to="/login" />} />
        <Route path="/daily" element={isLoggedIn ? <Daily /> : <Navigate to="/login" />} />
        <Route path="/aiNotes" element={isLoggedIn ? <AiNotes /> : <Navigate to="/login" />} />
        <Route path="/logout" element={!isLoggedIn ? <Navigate to="/" /> : () => { localStorage.clear(); window.location.reload() }} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
