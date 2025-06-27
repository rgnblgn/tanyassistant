// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Meeting from './pages/Meeting';
import Daily from './pages/Daily';
import AiNotes from './pages/aiNotes';
import JiraPage from './pages/Jirapage';

const App = () => {
  return (
    <Router>
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '16px' }}>
        <Link to="/" style={{ marginRight: '20px' }}>Anasayfa</Link>
        <Link to="/jira" style={{ marginRight: '20px' }}>Jira</Link>

        <Link to="/meeting" style={{ marginRight: '20px' }}>Meeting</Link>
        <Link to="/daily" style={{ marginRight: '20px' }}>Daily</Link>
        <Link to="/aiNotes">Ai Notes</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jira" element={<JiraPage />} />
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/daily" element={<Daily />} />
        <Route path="/aiNotes" element={<AiNotes />} />
      </Routes>
    </Router>
  );
};

export default App;
